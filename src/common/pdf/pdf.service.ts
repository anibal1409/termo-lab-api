import { createHash } from 'crypto';
// pdfkit es CommonJS (module.exports = clase) y el proyecto no usa esModuleInterop
// eslint-disable-next-line @typescript-eslint/no-require-imports
import PDFDocument = require('pdfkit');

import { Injectable } from '@nestjs/common';

export interface PdfSection {
  heading: string;
  /** Pares etiqueta → valor */
  fields?: [string, unknown][];
  /** Tabla con encabezados */
  table?: { headers: string[]; rows: unknown[][] };
  /** Lista de viñetas */
  bullets?: string[];
  /** Texto libre */
  text?: string;
}

export interface PdfReport {
  buffer: Buffer;
  /** SHA-256 del payload canónico (trazabilidad: mismo dato → mismo hash) */
  sha256: string;
}

/** Fuentes estándar PDF (WinAnsi): se reemplazan los símbolos que no cubren. */
function ascii(v: unknown): string {
  if (v == null || v === '') return '—';
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'number') {
    return Number.isFinite(v) ? String(+v.toFixed(4)) : '—';
  }
  if (typeof v === 'boolean') return v ? 'Sí' : 'No';
  return String(v)
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/η/g, 'eta')
    .replace(/Δ/g, 'd')
    .replace(/[^\x09\x0a\x0d\x20-\x7e\xa0-\xff–—…·°²³µ]/g, '?');
}

/** JSON con claves ordenadas: el hash no depende del orden de propiedades. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_k, v) =>
    v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date)
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, v[k]]),
        )
      : v,
  );
}

@Injectable()
export class PdfService {
  async render(
    title: string,
    subtitle: string,
    sections: PdfSection[],
    payload: unknown,
  ): Promise<PdfReport> {
    const sha256 = createHash('sha256')
      .update(canonicalJson(payload))
      .digest('hex');
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      bufferPages: true,
      info: { Title: ascii(title), Producer: 'TermoLab API', Subject: sha256 },
    });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    const done = new Promise<Buffer>((res) =>
      doc.on('end', () => res(Buffer.concat(chunks))),
    );

    const width = doc.page.width - 100;
    doc.font('Helvetica-Bold').fontSize(16).text(ascii(title));
    doc.font('Helvetica').fontSize(9).fillColor('#555').text(ascii(subtitle));
    doc.fillColor('black').moveDown();

    for (const s of sections) {
      if (doc.y > doc.page.height - 120) doc.addPage();
      doc.font('Helvetica-Bold').fontSize(12).text(ascii(s.heading));
      doc.moveDown(0.3).font('Helvetica').fontSize(9);
      for (const [k, v] of s.fields ?? []) {
        doc.font('Helvetica-Bold').text(`${ascii(k)}: `, { continued: true });
        doc.font('Helvetica').text(ascii(v));
      }
      if (s.text) doc.text(ascii(s.text), { width });
      for (const b of s.bullets ?? []) doc.text(`•  ${ascii(b)}`, { width });
      if (s.table) this.table(doc, s.table, width);
      doc.moveDown();
    }

    // Pie con hash y paginación en todas las páginas
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      const bottom = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc
        .fontSize(7)
        .fillColor('#777')
        .text(
          `SHA-256 ${sha256} · Página ${i + 1}/${range.count}`,
          50,
          doc.page.height - 35,
          { width, align: 'center' },
        );
      doc.page.margins.bottom = bottom;
    }
    doc.end();
    return { buffer: await done, sha256 };
  }

  private table(
    doc: PDFKit.PDFDocument,
    t: { headers: string[]; rows: unknown[][] },
    width: number,
  ) {
    const col = width / t.headers.length;
    const row = (cells: unknown[], bold: boolean) => {
      if (doc.y > doc.page.height - 80) doc.addPage();
      const y = doc.y;
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica');
      let h = 0;
      cells.forEach((c, i) => {
        doc.text(ascii(c), 50 + i * col, y, { width: col - 4 });
        h = Math.max(h, doc.y - y);
      });
      doc.x = 50;
      doc.y = y + h + 2;
    };
    row(t.headers, true);
    for (const r of t.rows) row(r, false);
    if (t.rows.length === 0) doc.text('(sin datos)');
  }
}

import { createTransport, Transporter } from 'nodemailer';

import { Injectable, Logger } from '@nestjs/common';

/**
 * Envío SMTP. Sin SMTP_HOST el correo se escribe en el log.
 * En producción hace falta SMTP_HOST, salvo SMTP_OPTIONAL=true (primer deploy).
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport: Transporter | null = process.env.SMTP_HOST
    ? createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        // true = TLS directo (465); false = STARTTLS obligatorio (587)
        secure: process.env.SMTP_SECURE === 'true',
        requireTLS: process.env.SMTP_SECURE !== 'true',
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      })
    : null;

  async send(to: string, subject: string, text: string, html: string) {
    if (!this.transport) {
      this.logger.warn(
        `[SMTP no configurado] Para: ${to} · ${subject}\n${text}`,
      );
      return;
    }
    await this.transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
  }

  /** Correo con enlace para definir contraseña (alta de usuario o reenvío). */
  async sendSetPassword(to: string, name: string, token: string) {
    // Token en el fragmento (#): el navegador no lo envía a servidores ni lo deja en logs/Referer
    const link = `${process.env.FRONTEND_URL}/set-password#token=${token}`;
    const safeName = escapeHtml(name);
    await this.send(
      to,
      'TermoLab · Define tu contraseña',
      `Hola ${name},\n\nSe creó tu cuenta en TermoLab. Define tu contraseña en este enlace (válido 24 horas, un solo uso):\n\n${link}\n\nSi no esperabas este correo, ignóralo.`,
      `<p>Hola ${safeName},</p><p>Se creó tu cuenta en TermoLab. Define tu contraseña en este enlace (válido 24 horas, un solo uso):</p><p><a href="${link}">Definir contraseña</a></p><p>Si no esperabas este correo, ignóralo.</p>`,
    );
  }
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
}

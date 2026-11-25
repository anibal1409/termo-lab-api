/**
 * Generación de cromatografía extendida a partir de °API.
 *
 * Usa correlaciones de Katz-Firoozabadi y Whitson (distribución gamma)
 * para generar una composición C1-C36+ desde parámetros macroscópicos
 * del crudo (°API, GOR estimado).
 *
 * Referencia:
 * - Whitson, C.H. "Characterizing Hydrocarbon Plus Fractions", SPE J, 1983.
 * - Katz, D.L. & Firoozabadi, A. "Predicting Phase Behavior of
 *   Condensate/Crude-Oil Systems Using Methane Interaction Coefficients", JPT, 1978.
 */

import { COMPONENT_DB, PureComponent } from './components';

export interface ChromatographyResult {
  /** Nombre de cada componente */
  components: string[];
  /** Fracción molar de cada componente (suma = 1) */
  moleFractions: number[];
  /** Peso molecular promedio del crudo */
  avgMW: number;
  /** Gravedad específica calculada */
  sg: number;
  /** GOR estimado (scf/bbl) */
  estimatedGOR: number;
}

/**
 * Genera cromatografía extendida desde °API y GOR opcional.
 *
 * @param apiGravity Grados API del crudo (8-50)
 * @param gor Gas-Oil Ratio en scf/bbl (opcional, se estima si no se da)
 * @param waterMolFrac Fracción molar de agua en el sistema (default 0)
 */
export function generateChromatography(
  apiGravity: number,
  gor?: number,
  waterMolFrac = 0,
): ChromatographyResult {
  // SG desde API
  const sg = 141.5 / (apiGravity + 131.5);

  // MW promedio del crudo (correlación de Cragoe)
  const mwCrude = 6084 / (apiGravity - 5.9);

  // GOR estimado si no se proporciona (correlación empírica para crudos venezolanos)
  const estimatedGOR = gor ?? estimateGOR(apiGravity);

  // Fracción molar de gas libre
  const gasLightFrac = Math.min(0.85, estimatedGOR / (estimatedGOR + 1000));

  // ── Distribución de livianos (C1-C5 + N2, CO2, H2S) ────
  const lights = distributeGasPhase(apiGravity, gasLightFrac);

  // ── Distribución de pesados (C6-C36+) por Whitson gamma ──
  const heavyFrac = 1 - gasLightFrac - waterMolFrac;
  const heavies = whitsonDistribution(mwCrude, sg, heavyFrac);

  // Ensamblar composición completa
  const composition = new Map<string, number>();

  // Gases y livianos
  for (const [name, frac] of lights) {
    composition.set(name, frac);
  }

  // Pesados
  for (const [name, frac] of heavies) {
    composition.set(name, (composition.get(name) ?? 0) + frac);
  }

  // Agua
  if (waterMolFrac > 0) {
    composition.set('Water', waterMolFrac);
  }

  // Mapear a orden de COMPONENT_DB
  const components: string[] = [];
  const moleFractions: number[] = [];
  let total = 0;

  for (const comp of COMPONENT_DB) {
    const frac = composition.get(comp.name) ?? 0;
    if (frac > 1e-8) {
      components.push(comp.name);
      moleFractions.push(frac);
      total += frac;
    }
  }

  // Normalizar
  for (let i = 0; i < moleFractions.length; i++) {
    moleFractions[i] /= total;
  }

  return { components, moleFractions, avgMW: mwCrude, sg, estimatedGOR };
}

// ── Distribución de gas (C1-C5 + no-HC) ───────────────────

function distributeGasPhase(api: number, totalFrac: number): Map<string, number> {
  const dist = new Map<string, number>();

  // Crudos más livianos tienen más metano; pesados más C3-C5
  // Correlaciones empíricas para crudos de la Faja del Orinoco hasta livianos
  const lightIndex = Math.max(0, Math.min(1, (api - 8) / 42)); // 0=8°API, 1=50°API

  // Fracciones relativas dentro del gas
  const c1Rel  = 0.30 + 0.45 * lightIndex;   // 30-75% del gas
  const c2Rel  = 0.10 + 0.10 * lightIndex;   // 10-20%
  const c3Rel  = 0.10 + 0.05 * lightIndex;   // 10-15%
  const ic4Rel = 0.03 + 0.02 * lightIndex;
  const nc4Rel = 0.05 + 0.03 * lightIndex;
  const ic5Rel = 0.02 + 0.01 * lightIndex;
  const nc5Rel = 0.03 + 0.01 * lightIndex;
  const n2Rel  = 0.005 + 0.01 * lightIndex;
  const co2Rel = 0.01 + 0.02 * lightIndex;
  const h2sRel = api < 20 ? 0.005 : 0.001;   // Crudos pesados tienen más H2S

  const sumRel = c1Rel + c2Rel + c3Rel + ic4Rel + nc4Rel + ic5Rel + nc5Rel + n2Rel + co2Rel + h2sRel;

  dist.set('Methane',    totalFrac * c1Rel / sumRel);
  dist.set('Ethane',     totalFrac * c2Rel / sumRel);
  dist.set('Propane',    totalFrac * c3Rel / sumRel);
  dist.set('i-Butane',   totalFrac * ic4Rel / sumRel);
  dist.set('n-Butane',   totalFrac * nc4Rel / sumRel);
  dist.set('i-Pentane',  totalFrac * ic5Rel / sumRel);
  dist.set('n-Pentane',  totalFrac * nc5Rel / sumRel);
  dist.set('Nitrogen',   totalFrac * n2Rel / sumRel);
  dist.set('Carbon Dioxide', totalFrac * co2Rel / sumRel);
  dist.set('Hydrogen Sulfide', totalFrac * h2sRel / sumRel);

  return dist;
}

// ── Distribución Whitson (gamma) para C6-C36+ ─────────────

function whitsonDistribution(mwCrude: number, sg: number, totalFrac: number): Map<string, number> {
  const dist = new Map<string, number>();

  // MW del C7+ desde MW global (descuenta livianos ~40 g/mol promedio)
  const mwC7plus = Math.max(100, mwCrude * 1.15);

  // Parámetro α de la distribución gamma de Whitson
  // α bajo → crudo muy pesado (cola larga), α alto → liviano (concentrado en C7-C12)
  const alpha = Math.max(0.5, Math.min(5, 500 / mwC7plus));

  // β = (MW_C7+ - η) / α, con η = MW_C6 = 86
  const eta = 86;
  const betaParam = (mwC7plus - eta) / alpha;

  // Generar fracción acumulada para cada SCN (single carbon number) C6-C36+
  const heavyComps = COMPONENT_DB.filter(c =>
    c.mw >= 86 && c.name !== 'Water' && c.name !== 'Carbon Dioxide' &&
    c.name !== 'Nitrogen' && c.name !== 'Hydrogen Sulfide'
  );

  const rawFracs: number[] = [];
  let sumRaw = 0;

  for (const comp of heavyComps) {
    // PDF de gamma evaluada en MW del componente
    const x = (comp.mw - eta) / betaParam;
    const pdf = x > 0 ? Math.pow(x, alpha - 1) * Math.exp(-x) : 0;
    rawFracs.push(pdf);
    sumRaw += pdf;
  }

  // Normalizar y asignar
  for (let i = 0; i < heavyComps.length; i++) {
    const frac = totalFrac * rawFracs[i] / sumRaw;
    if (frac > 1e-10) {
      dist.set(heavyComps[i].name, frac);
    }
  }

  return dist;
}

// ── GOR estimado desde °API ────────────────────────────────

function estimateGOR(api: number): number {
  // Correlación empírica: crudos pesados (<15°API) → GOR bajo
  // Crudos medianos (15-30°API) → GOR moderado
  // Crudos livianos (>30°API) → GOR alto
  if (api < 10) return 20;      // extrapesado
  if (api < 15) return 50;      // pesado
  if (api < 22) return 150;     // mediano-pesado
  if (api < 30) return 400;     // mediano
  if (api < 40) return 800;     // liviano
  return 1200;                   // muy liviano / condensado
}

/**
 * Obtiene los PureComponent correspondientes a una cromatografía.
 */
export function getComponentsForChromatography(
  result: ChromatographyResult,
): PureComponent[] {
  return result.components.map(name =>
    COMPONENT_DB.find(c => c.name === name)!,
  );
}

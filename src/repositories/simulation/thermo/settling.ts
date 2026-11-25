/**
 * Decantación Stokes + diámetros de gota Stewart (2008).
 * Si el usuario no da d, se usa el promedio del rango recomendado por tipo de crudo.
 * Unidades oilfield alineadas con ThermalCalculatorService (Ec. 1.22).
 */

export type CrudeClass =
  | 'extrapesado'
  | 'pesado'
  | 'mediano'
  | 'liviano'
  | 'condensado';

/** Rangos Stewart (2008) µm y promedio usado por defecto. */
const STEWART_SEPARATOR: Record<
  CrudeClass,
  { min: number; max: number; avg: number }
> = {
  extrapesado: { min: 500, max: 1500, avg: 1000 },
  pesado: { min: 400, max: 600, avg: 500 },
  mediano: { min: 300, max: 500, avg: 400 },
  liviano: { min: 200, max: 400, avg: 300 },
  condensado: { min: 100, max: 200, avg: 150 },
};

const STEWART_TREATER: Record<
  CrudeClass,
  { min: number; max: number; avg: number }
> = {
  extrapesado: { min: 200, max: 300, avg: 250 },
  pesado: { min: 150, max: 250, avg: 200 },
  mediano: { min: 100, max: 200, avg: 150 },
  liviano: { min: 80, max: 150, avg: 115 },
  condensado: { min: 50, max: 150, avg: 100 },
};

export function crudeClassFromApi(apiGravity: number): CrudeClass {
  if (apiGravity < 10) return 'extrapesado';
  if (apiGravity < 22) return 'pesado';
  if (apiGravity < 30) return 'mediano';
  if (apiGravity < 40) return 'liviano';
  return 'condensado';
}

/** Diámetro de diseño (µm): promedio Stewart 2008 del tipo de crudo. */
export function stewartDropDiameter_um(
  apiGravity: number,
  duty: 'separator' | 'treater' = 'separator',
): number {
  const cls = crudeClassFromApi(apiGravity);
  const table = duty === 'treater' ? STEWART_TREATER : STEWART_SEPARATOR;
  return table[cls].avg;
}

export function stewartDropRange(
  apiGravity: number,
  duty: 'separator' | 'treater' = 'separator',
): { crudeClass: CrudeClass; min_um: number; max_um: number; avg_um: number } {
  const crudeClass = crudeClassFromApi(apiGravity);
  const table = duty === 'treater' ? STEWART_TREATER : STEWART_SEPARATOR;
  const r = table[crudeClass];
  return {
    crudeClass,
    min_um: r.min,
    max_um: r.max,
    avg_um: r.avg,
  };
}

/**
 * Velocidad de decantación Stokes (fase pesada en liviana), ft/s.
 * V = 18.4663 · d² · (ρw − ρo) / μo con d en pulgadas (ρ lb/ft³, μ cP);
 * d llega en µm → se divide entre 25400².
 */
export function stokesSettlingVelocity_fts(
  dropSize_um: number,
  waterDensity_lbft3: number,
  oilDensity_lbft3: number,
  oilViscosity_cP: number,
): number {
  const mu = Math.max(oilViscosity_cP, 0.1);
  return (
    ((18.4663 / 25400 ** 2) *
      dropSize_um *
      dropSize_um *
      (waterDensity_lbft3 - oilDensity_lbft3)) /
    mu
  );
}

/** Viscosidad aproximada del crudo (cP) vs °API y T °C. */
export function estimateOilViscosity_cP(
  apiGravity: number,
  tempC: number,
): number {
  const tF = (tempC * 9) / 5 + 32;
  const base =
    apiGravity < 10
      ? 5000
      : apiGravity < 15
        ? 800
        : apiGravity < 22
          ? 80
          : apiGravity < 30
            ? 15
            : apiGravity < 40
              ? 5
              : 1.5;
  const factor = Math.pow(100 / Math.max(tF, 60), 1.5);
  return Math.max(0.5, base * factor);
}

export function kgm3ToLbft3(rho: number): number {
  return rho * 0.062428;
}

/**
 * Eficiencia de retiro de agua en separador bifásico (~80 % tipico),
 * progresiva con °API: pesados ↓, condensados → ~100 %.
 */
export function separatorWaterRemovalEfficiency(apiGravity: number): {
  free: number;
  emulsified: number;
  overallApprox: number;
} {
  const t = Math.max(0, Math.min(1, (apiGravity - 8) / 42));
  const free = 0.65 + 0.34 * t;
  const emulsified = 0.15 + 0.8 * t;
  const overallApprox = 0.55 * free + 0.45 * emulsified;
  return { free, emulsified, overallApprox };
}

/**
 * Ecuaciones de estado cúbicas: Peng-Robinson (1976) y Soave-Redlich-Kwong (1972).
 *
 * Resuelven Z³ + c₂Z² + c₁Z + c₀ = 0 para obtener factores de compresibilidad
 * de fases vapor y líquida, y de ahí fugacidades para equilibrio de fases.
 */

import { PureComponent, getKij } from './components';

const R = 8.31446;  // J/(mol·K)

// ── Tipos ──────────────────────────────────────────────────

export type EosType = 'PR' | 'SRK';

export interface EosParams {
  /** a_mix de la mezcla */
  amix: number;
  /** b_mix de la mezcla */
  bmix: number;
  /** a_i puro de cada componente */
  ai: number[];
  /** b_i puro de cada componente */
  bi: number[];
  /** A = amix·P / (R²T²) */
  A: number;
  /** B = bmix·P / (RT) */
  B: number;
}

export interface PhaseResult {
  Z: number;
  lnPhi: number[];  // ln(coef. fugacidad) de cada componente
}

// ── Constantes de cada EOS ─────────────────────────────────

const EOS_CONST = {
  PR:  { omegaA: 0.45724, omegaB: 0.07780, u: 2, w: -1, m: (omega: number) => 0.37464 + 1.54226 * omega - 0.26992 * omega ** 2 },
  SRK: { omegaA: 0.42748, omegaB: 0.08664, u: 1, w: 0,  m: (omega: number) => 0.48 + 1.574 * omega - 0.176 * omega ** 2 },
};

// ── Parámetros puros ───────────────────────────────────────

function pureParams(comp: PureComponent, T: number, eos: EosType) {
  const { omegaA, omegaB, m } = EOS_CONST[eos];
  const alpha = (1 + m(comp.omega) * (1 - Math.sqrt(T / comp.tc))) ** 2;
  const a = omegaA * R ** 2 * comp.tc ** 2 / comp.pc * alpha;
  const b = omegaB * R * comp.tc / comp.pc;
  return { a, b };
}

// ── Parámetros de mezcla (van der Waals one-fluid) ─────────

export function mixParams(
  components: PureComponent[],
  z: number[],
  T: number,
  P: number,
  eos: EosType,
): EosParams {
  const n = components.length;
  const pures = components.map(c => pureParams(c, T, eos));
  const ai = pures.map(p => p.a);
  const bi = pures.map(p => p.b);

  let amix = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const kij = getKij(components[i].formula, components[j].formula);
      amix += z[i] * z[j] * Math.sqrt(ai[i] * ai[j]) * (1 - kij);
    }
  }

  let bmix = 0;
  for (let i = 0; i < n; i++) bmix += z[i] * bi[i];

  const A = amix * P / (R * R * T * T);
  const B = bmix * P / (R * T);

  return { amix, bmix, ai, bi, A, B };
}

// ── Resolver cúbica en Z ───────────────────────────────────

function solveCubic(A: number, B: number, eos: EosType): number[] {
  const { u, w } = EOS_CONST[eos];
  // Z³ + c2·Z² + c1·Z + c0 = 0
  const c2 = -(1 + B - u * B);
  const c1 = A + w * B * B - u * B - u * B * B;
  const c0 = -(A * B + w * B * B + w * B * B * B);

  // Cardano
  const p = c1 - c2 * c2 / 3;
  const q = 2 * c2 ** 3 / 27 - c2 * c1 / 3 + c0;
  const disc = q * q / 4 + p ** 3 / 27;

  const roots: number[] = [];
  if (disc > 0) {
    const sqrtDisc = Math.sqrt(disc);
    const A3 = Math.cbrt(-q / 2 + sqrtDisc);
    const B3 = Math.cbrt(-q / 2 - sqrtDisc);
    roots.push(A3 + B3 - c2 / 3);
  } else {
    const r = Math.sqrt((-p) ** 3 / 27);
    const theta = Math.acos(-q / (2 * r));
    const m = 2 * Math.cbrt(r);
    for (let k = 0; k < 3; k++) {
      roots.push(m * Math.cos((theta + 2 * Math.PI * k) / 3) - c2 / 3);
    }
  }

  return roots.filter(z => z > B && z > 0).sort((a, b) => a - b);
}

// ── Fugacidades ────────────────────────────────────────────

function lnPhiMix(
  Z: number,
  components: PureComponent[],
  z: number[],
  params: EosParams,
  eos: EosType,
): number[] {
  const { amix, bmix, ai, bi, A, B } = params;
  const { u, w } = EOS_CONST[eos];
  const n = components.length;

  const delta1 = (u + Math.sqrt(u * u - 4 * w)) / 2;
  const delta2 = (u - Math.sqrt(u * u - 4 * w)) / 2;

  const lnPhi: number[] = [];
  for (let i = 0; i < n; i++) {
    // ∂(n·amix)/∂ni
    let sumAij = 0;
    for (let j = 0; j < n; j++) {
      const kij = getKij(components[i].formula, components[j].formula);
      sumAij += z[j] * Math.sqrt(ai[i] * ai[j]) * (1 - kij);
    }

    const biOverBmix = bi[i] / bmix;
    const term1 = biOverBmix * (Z - 1) - Math.log(Z - B);

    let term2: number;
    if (Math.abs(delta1 - delta2) < 1e-12) {
      term2 = -A / (B) * (2 * sumAij / amix - biOverBmix) * (1 / (Z + delta1 * B));
    } else {
      term2 = -A / (B * (delta1 - delta2)) *
        (2 * sumAij / amix - biOverBmix) *
        Math.log((Z + delta1 * B) / (Z + delta2 * B));
    }

    lnPhi.push(term1 + term2);
  }
  return lnPhi;
}

// ── API pública ────────────────────────────────────────────

/**
 * Calcula Z y ln(φ) para una fase dada.
 * @param phase 'V' toma la raíz mayor, 'L' la menor
 */
export function calcPhase(
  components: PureComponent[],
  z: number[],
  T: number,
  P: number,
  eos: EosType,
  phase: 'V' | 'L',
): PhaseResult {
  const params = mixParams(components, z, T, P, eos);
  const roots = solveCubic(params.A, params.B, eos);

  let Z: number;
  if (roots.length === 1) {
    Z = roots[0];
  } else {
    Z = phase === 'V' ? roots[roots.length - 1] : roots[0];
  }

  const lnPhi = lnPhiMix(Z, components, z, params, eos);
  return { Z, lnPhi };
}

/**
 * Presión de vapor estimada por Antoine simplificado (Wilson).
 * Ki = (Pc/P) * exp(5.373 * (1 + ω) * (1 - Tc/T))
 */
export function wilsonK(comp: PureComponent, T: number, P: number): number {
  return (comp.pc / P) * Math.exp(5.373 * (1 + comp.omega) * (1 - comp.tc / T));
}

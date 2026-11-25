/**
 * Flash bifásico isotérmico (PT-flash) usando Rachford-Rice con
 * sucesivas sustituciones aceleradas para obtener Ki de equilibrio.
 *
 * Algoritmo:
 * 1. Estimación inicial de Ki con correlación de Wilson
 * 2. Resolver Rachford-Rice para fracción vapor β
 * 3. Calcular composiciones xi, yi
 * 4. Calcular fugacidades con EOS → actualizar Ki
 * 5. Repetir hasta convergencia
 */

import { PureComponent } from './components';
import { EosType, calcPhase, wilsonK } from './eos';

export interface FlashResult {
  converged: boolean;
  iterations: number;
  /** Fracción molar de vapor (0 = todo líquido, 1 = todo vapor) */
  vaporFraction: number;
  /** Composición de la fase vapor (yi) */
  y: number[];
  /** Composición de la fase líquida (xi) */
  x: number[];
  /** Ki de equilibrio */
  K: number[];
  /** Factor de compresibilidad vapor */
  Zv: number;
  /** Factor de compresibilidad líquido */
  Zl: number;
  /** Fase: 'two-phase', 'all-vapor', 'all-liquid' */
  phase: 'two-phase' | 'all-vapor' | 'all-liquid';
}

/**
 * Resuelve Rachford-Rice: Σ zi(Ki-1) / (1 + β(Ki-1)) = 0
 * usando Newton-Raphson acotado a [0, 1].
 */
function solveRR(z: number[], K: number[]): number {
  const n = z.length;

  // Verificar si es todo vapor o todo líquido
  let sumTop = 0, sumBot = 0;
  for (let i = 0; i < n; i++) {
    sumTop += z[i] * (K[i] - 1);         // f(β=0)
    sumBot += z[i] * (K[i] - 1) / K[i];  // f(β=1)
  }
  if (sumTop <= 0) return 0;    // todo líquido
  if (sumBot >= 0) return 1;    // todo vapor

  let beta = 0.5;
  for (let iter = 0; iter < 100; iter++) {
    let f = 0, df = 0;
    for (let i = 0; i < n; i++) {
      const km1 = K[i] - 1;
      const denom = 1 + beta * km1;
      f += z[i] * km1 / denom;
      df -= z[i] * km1 * km1 / (denom * denom);
    }

    if (Math.abs(f) < 1e-12) break;

    let step = -f / df;
    // Acotamiento
    if (beta + step < 0) step = -beta * 0.5;
    if (beta + step > 1) step = (1 - beta) * 0.5;
    beta += step;
  }

  return Math.max(0, Math.min(1, beta));
}

/**
 * Flash PT completo.
 * @param components Componentes puros
 * @param z Composición global (fracciones molares, debe sumar 1)
 * @param T Temperatura (K)
 * @param P Presión (kPa)
 * @param eos 'PR' o 'SRK'
 * @param maxIter Máximo de iteraciones externas
 */
export function flashPT(
  components: PureComponent[],
  z: number[],
  T: number,
  P: number,
  eos: EosType = 'PR',
  maxIter = 200,
): FlashResult {
  const n = components.length;

  // 1. Ki iniciales (Wilson)
  const K = components.map(c => wilsonK(c, T, P));

  let beta: number;
  let x = new Array(n).fill(0);
  let y = new Array(n).fill(0);
  let Zv = 1, Zl = 0;
  let converged = false;
  let iter = 0;

  for (iter = 0; iter < maxIter; iter++) {
    // 2. Rachford-Rice
    beta = solveRR(z, K);

    // Fase única
    if (beta <= 1e-10) {
      return {
        converged: true, iterations: iter,
        vaporFraction: 0, y: [...z], x: [...z], K,
        Zv: 0, Zl: calcPhase(components, z, T, P, eos, 'L').Z,
        phase: 'all-liquid',
      };
    }
    if (beta >= 1 - 1e-10) {
      return {
        converged: true, iterations: iter,
        vaporFraction: 1, y: [...z], x: [...z], K,
        Zv: calcPhase(components, z, T, P, eos, 'V').Z, Zl: 0,
        phase: 'all-vapor',
      };
    }

    // 3. Composiciones
    for (let i = 0; i < n; i++) {
      x[i] = z[i] / (1 + beta * (K[i] - 1));
      y[i] = K[i] * x[i];
    }

    // Normalizar
    const sx = x.reduce((a, b) => a + b, 0);
    const sy = y.reduce((a, b) => a + b, 0);
    for (let i = 0; i < n; i++) { x[i] /= sx; y[i] /= sy; }

    // 4. Fugacidades con EOS
    const vap = calcPhase(components, y, T, P, eos, 'V');
    const liq = calcPhase(components, x, T, P, eos, 'L');
    Zv = vap.Z;
    Zl = liq.Z;

    // 5. Actualizar Ki = φL_i / φV_i
    let maxErr = 0;
    for (let i = 0; i < n; i++) {
      const Knew = Math.exp(liq.lnPhi[i] - vap.lnPhi[i]);
      const err = Math.abs(Knew / K[i] - 1);
      if (err > maxErr) maxErr = err;
      K[i] = Knew;
    }

    if (maxErr < 1e-8) {
      converged = true;
      break;
    }
  }

  // Resultado final
  beta = solveRR(z, K);
  for (let i = 0; i < n; i++) {
    x[i] = z[i] / (1 + beta * (K[i] - 1));
    y[i] = K[i] * x[i];
  }
  const sx = x.reduce((a, b) => a + b, 0);
  const sy = y.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) { x[i] /= sx; y[i] /= sy; }

  return {
    converged,
    iterations: iter,
    vaporFraction: beta,
    y, x, K,
    Zv, Zl,
    phase: 'two-phase',
  };
}

/**
 * GOR ↔ caudal de gas a partir del caudal de aceite (bruto − agua).
 */

export interface GasRateResolution {
  oilFlow_BPD: number;
  gasFlow_MMSCFD: number;
  gor: number;
  gorSource: 'user' | 'from_gas' | 'estimated_api';
  gasFlowSource: 'user' | 'from_gor' | 'from_estimated_gor';
}

/** Estima GOR (scf/bbl) desde °API si no hay dato de campo. */
export function estimateGorFromApi(apiGravity: number): number {
  if (apiGravity < 10) return 20;
  if (apiGravity < 15) return 50;
  if (apiGravity < 22) return 150;
  if (apiGravity < 30) return 400;
  if (apiGravity < 40) return 800;
  return 1200;
}

/**
 * Resuelve gas y GOR:
 * - Si hay gas y no GOR → GOR = gas·1e6 / aceite
 * - Si hay GOR y no gas → gas = aceite · GOR / 1e6
 * - Si no hay ninguno → GOR estimado por °API y gas derivado
 * - Si hay ambos → se respetan; el flujo de gas manda en operación
 */
export function resolveGasRates(params: {
  oilFlow_BPD: number;
  apiGravity: number;
  gasFlow_MMSCFD?: number;
  gor?: number;
  /** GOR ya estimado por cromatografía (Whitson), si existe */
  chromEstimatedGor?: number;
}): GasRateResolution {
  const oil = Math.max(params.oilFlow_BPD, 1e-9);
  const hasGas = params.gasFlow_MMSCFD != null && Number.isFinite(params.gasFlow_MMSCFD);
  const hasGor = params.gor != null && Number.isFinite(params.gor);

  if (hasGas && !hasGor) {
    const gas = Math.max(0, params.gasFlow_MMSCFD!);
    return {
      oilFlow_BPD: oil,
      gasFlow_MMSCFD: gas,
      gor: (gas * 1e6) / oil,
      gorSource: 'from_gas',
      gasFlowSource: 'user',
    };
  }

  if (hasGor && !hasGas) {
    const gor = Math.max(0, params.gor!);
    return {
      oilFlow_BPD: oil,
      gasFlow_MMSCFD: (oil * gor) / 1e6,
      gor,
      gorSource: 'user',
      gasFlowSource: 'from_gor',
    };
  }

  if (hasGor && hasGas) {
    return {
      oilFlow_BPD: oil,
      gasFlow_MMSCFD: Math.max(0, params.gasFlow_MMSCFD!),
      gor: Math.max(0, params.gor!),
      gorSource: 'user',
      gasFlowSource: 'user',
    };
  }

  const gor =
    params.chromEstimatedGor ?? estimateGorFromApi(params.apiGravity);
  return {
    oilFlow_BPD: oil,
    gasFlow_MMSCFD: (oil * gor) / 1e6,
    gor,
    gorSource: 'estimated_api',
    gasFlowSource: 'from_estimated_gor',
  };
}

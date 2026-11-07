import { Injectable } from '@nestjs/common';

// ── Types ──────────────────────────────────────────────────

export interface TwinParams {
  mass: number;       // lb (pilot fluid mass)
  cp: number;         // BTU/(lb·°F)
  eta: number;        // heater efficiency 0–1
  ua: number;         // heat loss coefficient BTU/(h·°F)
  heaterPower: number; // BTU/h (nominal)
}

export interface TwinPoint {
  t: number;   // seconds since start
  real: number;
  simulated: number;
  error: number;
}

export interface CalibrationResult {
  eta: number;
  ua: number;
  rmse: number;
  points: number;
}

export interface TimeSeries {
  t: number;   // seconds since start
  value: number;
}

// ── Pure functions ─────────────────────────────────────────

export function pilotMass(
  diameterFt: number,
  lengthFt: number,
  waterDensityLbPerFt3 = 62.4,
): number {
  const r = diameterFt / 2;
  const volume = Math.PI * r * r * lengthFt;
  return volume * waterDensityLbPerFt3;
}

export function twinStep(
  params: TwinParams,
  T: number,
  Tamb: number,
  heaterOn: boolean,
  dtSec: number,
): number {
  const dtHr = dtSec / 3600;
  const P = heaterOn ? params.heaterPower : 0;
  const dT = (params.eta * P - params.ua * (T - Tamb)) / (params.mass * params.cp);
  return T + dT * dtHr;
}

export function simulateTwin(
  params: TwinParams,
  T0: number,
  heaterSeries: TimeSeries[],
  ambientSeries: TimeSeries[],
  realTempSeries: TimeSeries[],
): TwinPoint[] {
  if (realTempSeries.length === 0) return [];

  const ambientAt = (t: number) => interpolate(ambientSeries, t);
  const heaterAt = (t: number) => interpolate(heaterSeries, t) > 0.5;

  const points: TwinPoint[] = [];
  let Tsim = T0;

  for (let i = 0; i < realTempSeries.length; i++) {
    const { t, value: Treal } = realTempSeries[i];
    const dt = i === 0 ? 0 : t - realTempSeries[i - 1].t;
    if (dt > 0) {
      Tsim = twinStep(params, Tsim, ambientAt(t), heaterAt(t), dt);
    }
    points.push({
      t,
      real: Treal,
      simulated: +Tsim.toFixed(3),
      error: +(Treal - Tsim).toFixed(3),
    });
  }
  return points;
}

// ponytail: linear regression for 2 params, no library needed
export function calibrate(
  mass: number,
  cp: number,
  heaterPower: number,
  realTemp: TimeSeries[],
  ambientTemp: TimeSeries[],
  heaterState: TimeSeries[],
): CalibrationResult {
  if (realTemp.length < 3) {
    return { eta: 0.85, ua: 5, rmse: Infinity, points: realTemp.length };
  }

  const ambientAt = (t: number) => interpolate(ambientTemp, t);
  const heaterAt = (t: number) => interpolate(heaterState, t) > 0.5;

  // y_i = eta * x1_i + UA * x2_i
  // where y_i = m*cp*(T[i+1]-T[i]) / dt_hr
  //       x1_i = P (if heater on, else 0)
  //       x2_i = -(T[i] - Tamb[i])
  let sx1x1 = 0, sx1x2 = 0, sx2x2 = 0, sx1y = 0, sx2y = 0;
  let n = 0;

  for (let i = 0; i < realTemp.length - 1; i++) {
    const dt = realTemp[i + 1].t - realTemp[i].t;
    if (dt <= 0) continue;
    const dtHr = dt / 3600;
    const T = realTemp[i].value;
    const Tnext = realTemp[i + 1].value;
    const Tamb = ambientAt(realTemp[i].t);
    const P = heaterAt(realTemp[i].t) ? heaterPower : 0;

    const y = mass * cp * (Tnext - T) / dtHr;
    const x1 = P;
    const x2 = -(T - Tamb);

    sx1x1 += x1 * x1;
    sx1x2 += x1 * x2;
    sx2x2 += x2 * x2;
    sx1y += x1 * y;
    sx2y += x2 * y;
    n++;
  }

  // Solve 2x2 normal equations: [sx1x1 sx1x2; sx1x2 sx2x2] [eta; ua] = [sx1y; sx2y]
  const det = sx1x1 * sx2x2 - sx1x2 * sx1x2;
  let eta: number, ua: number;

  if (Math.abs(det) < 1e-12) {
    eta = 0.85;
    ua = 5;
  } else {
    eta = (sx2x2 * sx1y - sx1x2 * sx2y) / det;
    ua = (sx1x1 * sx2y - sx1x2 * sx1y) / det;
  }

  // Clamp to physical bounds
  eta = Math.max(0.1, Math.min(1.0, eta));
  ua = Math.max(0, ua);

  // Compute RMSE with calibrated params
  const params: TwinParams = { mass, cp, eta, ua, heaterPower };
  const points = simulateTwin(
    params,
    realTemp[0].value,
    heaterState,
    ambientTemp,
    realTemp,
  );
  const mse = points.reduce((s, p) => s + p.error * p.error, 0) / (points.length || 1);

  return {
    eta: +eta.toFixed(4),
    ua: +ua.toFixed(4),
    rmse: +Math.sqrt(mse).toFixed(4),
    points: n,
  };
}

function interpolate(series: TimeSeries[], t: number): number {
  if (series.length === 0) return 0;
  if (t <= series[0].t) return series[0].value;
  if (t >= series[series.length - 1].t) return series[series.length - 1].value;
  for (let i = 1; i < series.length; i++) {
    if (series[i].t >= t) {
      const dt = series[i].t - series[i - 1].t;
      if (dt === 0) return series[i].value;
      const frac = (t - series[i - 1].t) / dt;
      return series[i - 1].value + frac * (series[i].value - series[i - 1].value);
    }
  }
  return series[series.length - 1].value;
}

// ── Service ────────────────────────────────────────────────

@Injectable()
export class ThermalTwinService {
  simulate(
    params: TwinParams,
    T0: number,
    heaterSeries: TimeSeries[],
    ambientSeries: TimeSeries[],
    realTempSeries: TimeSeries[],
  ): TwinPoint[] {
    return simulateTwin(params, T0, heaterSeries, ambientSeries, realTempSeries);
  }

  calibrate(
    mass: number,
    cp: number,
    heaterPower: number,
    realTemp: TimeSeries[],
    ambientTemp: TimeSeries[],
    heaterState: TimeSeries[],
  ): CalibrationResult {
    return calibrate(mass, cp, heaterPower, realTemp, ambientTemp, heaterState);
  }

  pilotMass(diameterFt: number, lengthFt: number): number {
    return pilotMass(diameterFt, lengthFt);
  }
}

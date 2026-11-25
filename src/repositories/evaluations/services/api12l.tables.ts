/**
 * Tablas de API Spec 12L (1994), transcritas de api-12l-standard.pdf.
 * Única fuente de verdad para calculador, simulador y tratamientos.
 */

export type Orientation = 'horizontal' | 'vertical';

/**
 * Apéndice D (pérdida de calor): Ql = K·D·L·(T2 − Ta).
 * K = 9.3 aire quieto; 9.8 a 5 mph; 13.2 a 10 mph; 15.7 a 20 mph.
 * Entre puntos se interpola; sobre 20 mph la norma no da valor → se usa 15.7.
 */
const WIND_K: [number, number][] = [
  [0, 9.3],
  [5, 9.8],
  [10, 13.2],
  [20, 15.7],
];

export function api12lWindK(windSpeed: number): number {
  if (!(windSpeed > WIND_K[0][0])) return WIND_K[0][1];
  for (let i = 1; i < WIND_K.length; i++) {
    const [x2, y2] = WIND_K[i];
    if (windSpeed <= x2) {
      const [x1, y1] = WIND_K[i - 1];
      return y1 + ((y2 - y1) * (windSpeed - x1)) / (x2 - x1);
    }
  }
  return WIND_K[WIND_K.length - 1][1];
}

/**
 * Apéndice D: recipiente aislado ≈ 5–10 % de la pérdida del desnudo.
 * Se usa el 10 % (extremo conservador).
 */
export const API12L_INSULATED_LOSS_FACTOR = 0.1;

export interface Api12lSize {
  diameter: number; // ft (diámetro exterior)
  length: number; // ft (costura a costura)
  pressure: number; // psig, presión mínima de diseño
  oilBbl: number; // Tabla E-1: volumen de retención de crudo
  waterBbl: number; // Tabla E-1: volumen de retención de agua
}

/** Tabla 1 (vertical) + volúmenes de Tabla E-1. */
export const API12L_VERTICAL_SIZES: Api12lSize[] = [
  { diameter: 3, length: 10, pressure: 50, oilBbl: 5.9, waterBbl: 4.0 },
  { diameter: 3, length: 12, pressure: 50, oilBbl: 7.0, waterBbl: 4.7 },
  { diameter: 3, length: 15, pressure: 50, oilBbl: 8.6, waterBbl: 5.8 },
  { diameter: 4, length: 10, pressure: 50, oilBbl: 10.7, waterBbl: 7.2 },
  { diameter: 4, length: 12, pressure: 50, oilBbl: 12.6, waterBbl: 8.6 },
  { diameter: 4, length: 20, pressure: 50, oilBbl: 19.4, waterBbl: 10.4 },
  { diameter: 4, length: 27.5, pressure: 50, oilBbl: 30.3, waterBbl: 17.1 },
  { diameter: 6, length: 12, pressure: 50, oilBbl: 30.4, waterBbl: 20.5 },
  { diameter: 6, length: 20, pressure: 50, oilBbl: 44.2, waterBbl: 27.5 },
  { diameter: 6, length: 27.5, pressure: 50, oilBbl: 68.6, waterBbl: 42.6 },
  { diameter: 8, length: 20, pressure: 40, oilBbl: 78.3, waterBbl: 48.0 },
  { diameter: 8, length: 27.5, pressure: 40, oilBbl: 121.4, waterBbl: 74.9 },
  { diameter: 10, length: 20, pressure: 40, oilBbl: 122.4, waterBbl: 82.5 },
  { diameter: 10, length: 27.5, pressure: 40, oilBbl: 189.6, waterBbl: 124.5 },
];

/** Tabla 2 (horizontal) + volúmenes de Tabla E-1. */
export const API12L_HORIZONTAL_SIZES: Api12lSize[] = [
  { diameter: 3, length: 10, pressure: 50, oilBbl: 6.6, waterBbl: 4.4 },
  { diameter: 3, length: 12, pressure: 50, oilBbl: 7.8, waterBbl: 5.2 },
  { diameter: 3, length: 15, pressure: 50, oilBbl: 9.6, waterBbl: 6.4 },
  { diameter: 4, length: 10, pressure: 50, oilBbl: 11.9, waterBbl: 7.9 },
  { diameter: 4, length: 12, pressure: 50, oilBbl: 14.1, waterBbl: 9.5 },
  { diameter: 4, length: 15, pressure: 50, oilBbl: 17.3, waterBbl: 11.5 },
  // ponytail: Tabla 2 lista 6×10 pero E-1 solo trae 6×12 (33.2/22.6); se escala por longitud (×10/12)
  { diameter: 6, length: 10, pressure: 50, oilBbl: 27.7, waterBbl: 18.8 },
  { diameter: 6, length: 15, pressure: 50, oilBbl: 39.3, waterBbl: 26.4 },
  { diameter: 6, length: 20, pressure: 50, oilBbl: 51.0, waterBbl: 34.8 },
  { diameter: 8, length: 15, pressure: 50, oilBbl: 69.4, waterBbl: 46.5 },
  { diameter: 8, length: 20, pressure: 50, oilBbl: 88.4, waterBbl: 59.2 },
  { diameter: 8, length: 25, pressure: 50, oilBbl: 108.7, waterBbl: 73.0 },
  { diameter: 8, length: 30, pressure: 50, oilBbl: 128.9, waterBbl: 85.9 },
  { diameter: 10, length: 20, pressure: 50, oilBbl: 144.7, waterBbl: 96.9 },
  { diameter: 10, length: 30, pressure: 50, oilBbl: 217.8, waterBbl: 142.6 },
  { diameter: 10, length: 40, pressure: 50, oilBbl: 284.7, waterBbl: 183.9 },
  { diameter: 10, length: 50, pressure: 50, oilBbl: 351.8, waterBbl: 227.2 },
  { diameter: 10, length: 60, pressure: 50, oilBbl: 419.0, waterBbl: 270.6 },
  { diameter: 12, length: 30, pressure: 50, oilBbl: 324.7, waterBbl: 217.6 },
  { diameter: 12, length: 40, pressure: 50, oilBbl: 422.6, waterBbl: 284.6 },
  { diameter: 12, length: 50, pressure: 50, oilBbl: 521.3, waterBbl: 351.1 },
  { diameter: 12, length: 60, pressure: 50, oilBbl: 619.9, waterBbl: 417.5 },
];

export function api12lSizes(orientation: Orientation): Api12lSize[] {
  return orientation === 'vertical'
    ? API12L_VERTICAL_SIZES
    : API12L_HORIZONTAL_SIZES;
}

/**
 * Tabla 3: firebox mínimo por diámetro exterior y orientación (área ft², duty BTU/h).
 * Todas equivalen a 10 000 BTU/h·ft² (5.3, flujo máximo en el firetube).
 */
const FIREBOX: Record<Orientation, Record<number, [number, number]>> = {
  vertical: {
    3: [10, 100_000],
    4: [25, 250_000],
    6: [50, 500_000],
    8: [100, 1_000_000],
    10: [125, 1_250_000],
  },
  horizontal: {
    3: [15, 150_000],
    4: [25, 250_000],
    6: [50, 500_000],
    8: [75, 750_000],
    10: [200, 2_000_000],
    12: [320, 3_200_000],
  },
};

/** 5.3: flujo de calor promedio máximo en el firetube (BTU/h·ft²). */
export const API12L_MAX_HEAT_FLUX = 10_000;

/** Apéndice D: viscosidad máxima recomendada del crudo a T de tratamiento (cP ≈ 150 SSU). */
export const API12L_MAX_OIL_VISCOSITY_CP = 30;

/**
 * Rating de Tabla 3 para un diámetro. Si no es estándar, se usa el diámetro
 * estándar inmediatamente menor (conservador). null si no hay rating.
 */
export function api12lFirebox(
  diameter: number,
  orientation: Orientation,
): { diameter: number; area: number; duty: number } | null {
  const rows = FIREBOX[orientation];
  const d = Object.keys(rows)
    .map(Number)
    .filter((x) => x <= diameter)
    .pop();
  if (d == null) return null;
  // Vertical de 12 ft no tiene rating en la norma
  if (orientation === 'vertical' && diameter > 10) return null;
  const [area, duty] = rows[d];
  return { diameter: d, area, duty };
}

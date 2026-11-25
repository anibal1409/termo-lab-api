/**
 * Densidad / SG / MW de gas asociado a partir de cromatografía.
 */

import {
  generateChromatography,
  ChromatographyResult,
} from './chromatography';
import { COMPONENT_DB } from './components';

const LIGHTS = new Set([
  'Methane',
  'Ethane',
  'Propane',
  'i-Butane',
  'n-Butane',
  'i-Pentane',
  'n-Pentane',
  'Nitrogen',
  'Carbon Dioxide',
  'Hydrogen Sulfide',
]);

export interface GasProps {
  gasMW: number;
  gasSG: number;
  gasDensity_kgm3: number;
  chromatography: ChromatographyResult;
}

export interface MoleFractionItem {
  name: string;
  moleFraction: number;
}

/** Construye ChromatographyResult desde composición cargada por el usuario. */
export function chromatographyFromComposition(
  items: MoleFractionItem[],
  apiGravity: number,
  gor?: number,
): ChromatographyResult {
  const components: string[] = [];
  const moleFractions: number[] = [];
  let sum = 0;
  for (const item of items) {
    if (!item?.name || !(item.moleFraction > 0)) continue;
    const db = COMPONENT_DB.find(
      (c) => c.name === item.name || c.formula === item.name,
    );
    if (!db) continue;
    components.push(db.name);
    moleFractions.push(item.moleFraction);
    sum += item.moleFraction;
  }
  if (sum <= 0) {
    return generateChromatography(apiGravity, gor);
  }
  for (let i = 0; i < moleFractions.length; i++) {
    moleFractions[i] /= sum;
  }
  const avgMW = components.reduce((s, name, i) => {
    const c = COMPONENT_DB.find((x) => x.name === name)!;
    return s + c.mw * moleFractions[i];
  }, 0);
  const sg = 141.5 / (apiGravity + 131.5);
  return {
    components,
    moleFractions,
    avgMW,
    sg,
    estimatedGOR: gor ?? estimateGOR(apiGravity),
  };
}

/** MW y densidad del gas asociado (fracción liviana de la cromatografía). */
export function gasPropsFromApi(
  apiGravity: number,
  temperature_C: number,
  pressure_kPa: number,
  gor?: number,
  waterMolFrac = 0,
): GasProps {
  const chromatography = generateChromatography(apiGravity, gor, waterMolFrac);
  return gasPropsFromChromatography(
    chromatography,
    temperature_C,
    pressure_kPa,
  );
}

export function gasPropsFromChromatography(
  chromatography: ChromatographyResult,
  temperature_C: number,
  pressure_kPa: number,
): GasProps {
  let sumY = 0;
  let sumYMw = 0;
  for (let i = 0; i < chromatography.components.length; i++) {
    const name = chromatography.components[i];
    if (!LIGHTS.has(name)) continue;
    const y = chromatography.moleFractions[i];
    const comp = COMPONENT_DB.find((c) => c.name === name);
    if (!comp) continue;
    sumY += y;
    sumYMw += y * comp.mw;
  }
  const gasMW = sumY > 1e-12 ? sumYMw / sumY : 20;
  const gasSG = gasMW / 28.97;
  const T = temperature_C + 273.15;
  const gasDensity_kgm3 = (pressure_kPa * gasMW) / (8.314 * T);
  return { gasMW, gasSG, gasDensity_kgm3, chromatography };
}

function estimateGOR(api: number): number {
  if (api < 10) return 20;
  if (api < 15) return 50;
  if (api < 22) return 150;
  if (api < 30) return 400;
  if (api < 40) return 800;
  return 1200;
}

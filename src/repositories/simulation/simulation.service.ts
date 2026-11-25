import { Injectable } from '@nestjs/common';
import {
  COMPONENT_DB,
  PureComponent,
  generateChromatography,
  getComponentsForChromatography,
  ChromatographyResult,
  flashPT,
  FlashResult,
  EosType,
  calcPhase,
  chromatographyFromComposition,
  resolveGasRates,
} from './thermo';
import { ChromatographyInputDto } from './dto/simulation.dto';

const R = 8.31446; // J/(mol·K)

@Injectable()
export class SimulationService {

  /**
   * Genera cromatografía extendida desde °API.
   */
  chromatography(apiGravity: number, gor?: number, waterMolFrac?: number): ChromatographyResult {
    return generateChromatography(apiGravity, gor, waterMolFrac);
  }

  /**
   * Cromatografía + caudales: bruto → aceite; gas automático vía GOR.
   */
  chromatographyWithRates(dto: ChromatographyInputDto) {
    let chrom: ChromatographyResult;
    if (dto.composition?.length) {
      chrom = chromatographyFromComposition(
        dto.composition,
        dto.apiGravity,
        dto.gor,
      );
    } else {
      chrom = generateChromatography(
        dto.apiGravity,
        dto.gor,
        dto.waterMolFrac,
      );
    }

    const waterFrac =
      dto.bsw != null
        ? dto.bsw / 100
        : dto.waterFraction != null
          ? dto.waterFraction
          : 0;

    let oilFlow_BPD = dto.oilFlow_BPD;
    if (oilFlow_BPD == null && dto.totalFlow_BPD != null) {
      oilFlow_BPD = dto.totalFlow_BPD * (1 - waterFrac);
    }
    oilFlow_BPD = oilFlow_BPD ?? 0;

    const rates =
      oilFlow_BPD > 0
        ? resolveGasRates({
            oilFlow_BPD,
            apiGravity: dto.apiGravity,
            gasFlow_MMSCFD: dto.gasFlow_MMSCFD,
            gor: dto.gor,
            chromEstimatedGor: chrom.estimatedGOR,
          })
        : {
            oilFlow_BPD: 0,
            gasFlow_MMSCFD: dto.gasFlow_MMSCFD ?? 0,
            gor: dto.gor ?? chrom.estimatedGOR,
            gorSource: dto.gor != null ? 'user' : 'estimated_api',
            gasFlowSource:
              dto.gasFlow_MMSCFD != null ? 'user' : 'from_estimated_gor',
          };

    // Alinear estimatedGOR de la cromatografía con el GOR resuelto
    chrom = { ...chrom, estimatedGOR: rates.gor };

    return {
      ...chrom,
      totalFlow_BPD: dto.totalFlow_BPD,
      oilFlow_BPD: rates.oilFlow_BPD,
      gasFlow_MMSCFD: rates.gasFlow_MMSCFD,
      gor: rates.gor,
      gorSource: rates.gorSource,
      gasFlowSource: rates.gasFlowSource,
      waterFraction: waterFrac,
      bsw: waterFrac * 100,
    };
  }

  /**
   * Flash PT: separación de fases a condiciones dadas.
   */
  flash(
    apiGravity: number,
    temperatureC: number,
    pressureKpa: number,
    eos: EosType = 'PR',
    gor?: number,
    waterMolFrac?: number,
    customComposition?: { name: string; moleFraction: number }[],
  ) {
    let components: PureComponent[];
    let z: number[];

    if (customComposition?.length) {
      components = customComposition.map(c => COMPONENT_DB.find(db => db.name === c.name || db.formula === c.name)!).filter(Boolean);
      z = customComposition.filter((_, i) => components[i]).map(c => c.moleFraction);
      const sum = z.reduce((a, b) => a + b, 0);
      z = z.map(v => v / sum);
    } else {
      const chrom = generateChromatography(apiGravity, gor, waterMolFrac);
      components = getComponentsForChromatography(chrom);
      z = chrom.moleFractions;
    }

    const T = temperatureC + 273.15;
    const result = flashPT(components, z, T, pressureKpa, eos);

    return this.formatFlashResult(components, z, result, T, pressureKpa, eos);
  }

  /**
   * Propiedades del fluido a condiciones dadas.
   */
  fluidProperties(
    apiGravity: number,
    temperatureC: number,
    pressureKpa: number,
    eos: EosType = 'PR',
    gor?: number,
  ) {
    const chrom = generateChromatography(apiGravity, gor);
    const components = getComponentsForChromatography(chrom);
    const z = chrom.moleFractions;
    const T = temperatureC + 273.15;

    const flashResult = flashPT(components, z, T, pressureKpa, eos);

    // Propiedades de cada fase
    const sg = 141.5 / (apiGravity + 131.5);
    const mwMix = components.reduce((s, c, i) => s + c.mw * z[i], 0);

    // Densidades
    const rhoVapor = flashResult.Zv > 0
      ? pressureKpa * mwMix / (flashResult.Zv * R * T) / 1000 // kg/m³
      : 0;

    const mwLiq = components.reduce((s, c, i) => s + c.mw * flashResult.x[i], 0);
    const rhoLiquid = sg * 1000; // kg/m³ aproximado

    // Viscosidad del crudo (correlación de Beggs-Robinson)
    const tempF = temperatureC * 9 / 5 + 32;
    const X = Math.pow(10, 3.0324 - 0.02023 * apiGravity) * Math.pow(tempF, -1.163);
    const muDeadOil = Math.pow(10, X) - 1; // cP

    // Corrección por gas disuelto (Chew-Connally)
    const Rs = gor ?? this.estimateRs(apiGravity, temperatureC, pressureKpa);
    const A = 10.715 * Math.pow(Rs + 100, -0.515);
    const B = 5.44 * Math.pow(Rs + 150, -0.338);
    const muLiveOil = A * Math.pow(muDeadOil, B);

    return {
      eos,
      temperature: { C: temperatureC, K: T, F: tempF },
      pressure: { kPa: pressureKpa, psi: pressureKpa * 0.145038 },
      chromatography: {
        components: chrom.components,
        moleFractions: chrom.moleFractions,
        avgMW: chrom.avgMW,
      },
      flash: {
        phase: flashResult.phase,
        vaporFraction: flashResult.vaporFraction,
        converged: flashResult.converged,
        iterations: flashResult.iterations,
      },
      vaporPhase: {
        Zv: flashResult.Zv,
        density_kgm3: rhoVapor,
        mw: components.reduce((s, c, i) => s + c.mw * flashResult.y[i], 0),
      },
      liquidPhase: {
        Zl: flashResult.Zl,
        density_kgm3: rhoLiquid,
        mw: mwLiq,
        viscosity_cP: muLiveOil,
        deadOilViscosity_cP: muDeadOil,
      },
      crudeProperties: {
        apiGravity,
        specificGravity: sg,
        avgMW: mwMix,
        estimatedGOR: chrom.estimatedGOR,
      },
    };
  }

  /**
   * Lista de componentes disponibles en la base de datos.
   */
  getComponents() {
    return COMPONENT_DB.map(c => ({
      name: c.name,
      formula: c.formula,
      mw: c.mw,
      tc: c.tc,
      pc: c.pc,
      omega: c.omega,
      tb: c.tb,
    }));
  }

  // ── Privados ─────────────────────────────────────────────

  private formatFlashResult(
    components: PureComponent[],
    z: number[],
    result: FlashResult,
    T: number,
    P: number,
    eos: EosType,
  ) {
    const table = components.map((c, i) => ({
      component: c.name,
      formula: c.formula,
      mw: c.mw,
      zi: z[i],
      xi: result.x[i],
      yi: result.y[i],
      Ki: result.K[i],
    }));

    return {
      eos,
      temperature: { C: T - 273.15, K: T },
      pressure: { kPa: P, psi: P * 0.145038 },
      result: {
        phase: result.phase,
        vaporFraction: result.vaporFraction,
        liquidFraction: 1 - result.vaporFraction,
        Zv: result.Zv,
        Zl: result.Zl,
        converged: result.converged,
        iterations: result.iterations,
      },
      componentTable: table,
    };
  }

  private estimateRs(api: number, tempC: number, pressKpa: number): number {
    // Correlación de Standing para Rs (gas disuelto)
    const pressPsi = pressKpa * 0.145038;
    const tempF = tempC * 9 / 5 + 32;
    const sg = 141.5 / (api + 131.5);
    const yg = 0.75; // SG del gas asumido
    const Rs = yg * Math.pow(pressPsi / 18.2 + 1.4, 1.2048) *
      Math.pow(10, 0.0125 * api - 0.00091 * tempF);
    return Math.max(0, Rs);
  }
}

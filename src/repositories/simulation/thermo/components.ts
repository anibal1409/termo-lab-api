/**
 * Base de datos de componentes puros para simulación de procesos.
 * Propiedades críticas: Tc (K), Pc (kPa), ω (factor acéntrico), MW (g/mol).
 * Fuentes: Reid, Prausnitz & Poling; DIPPR; API Technical Data Book.
 */

export interface PureComponent {
  name: string;
  formula: string;
  mw: number;      // g/mol
  tc: number;       // K
  pc: number;       // kPa
  omega: number;    // factor acéntrico
  tb: number;       // temperatura de ebullición normal (K)
  sg?: number;      // gravedad específica líquida a 15.6°C
}

// ── Gases y livianos ───────────────────────────────────────
const N2:  PureComponent = { name: 'Nitrogen',       formula: 'N2',    mw: 28.014,  tc: 126.2,   pc: 3394,  omega: 0.0377, tb: 77.4 };
const CO2: PureComponent = { name: 'Carbon Dioxide',  formula: 'CO2',   mw: 44.010,  tc: 304.2,   pc: 7383,  omega: 0.2236, tb: 194.7 };
const H2S: PureComponent = { name: 'Hydrogen Sulfide',formula: 'H2S',   mw: 34.082,  tc: 373.5,   pc: 8963,  omega: 0.0942, tb: 212.8 };
const H2O: PureComponent = { name: 'Water',           formula: 'H2O',   mw: 18.015,  tc: 647.1,   pc: 22064, omega: 0.3449, tb: 373.2 };

// ── Hidrocarburos C1-C10 ───────────────────────────────────
const C1:  PureComponent = { name: 'Methane',    formula: 'CH4',    mw: 16.043,  tc: 190.6,  pc: 4599,  omega: 0.0115, tb: 111.7, sg: 0.300 };
const C2:  PureComponent = { name: 'Ethane',     formula: 'C2H6',   mw: 30.070,  tc: 305.3,  pc: 4872,  omega: 0.0995, tb: 184.6, sg: 0.356 };
const C3:  PureComponent = { name: 'Propane',    formula: 'C3H8',   mw: 44.096,  tc: 369.8,  pc: 4248,  omega: 0.1523, tb: 231.1, sg: 0.507 };
const iC4: PureComponent = { name: 'i-Butane',   formula: 'iC4H10', mw: 58.123,  tc: 408.1,  pc: 3640,  omega: 0.1770, tb: 261.4, sg: 0.563 };
const nC4: PureComponent = { name: 'n-Butane',   formula: 'nC4H10', mw: 58.123,  tc: 425.1,  pc: 3796,  omega: 0.2002, tb: 272.7, sg: 0.584 };
const iC5: PureComponent = { name: 'i-Pentane',  formula: 'iC5H12', mw: 72.150,  tc: 460.4,  pc: 3381,  omega: 0.2275, tb: 301.0, sg: 0.625 };
const nC5: PureComponent = { name: 'n-Pentane',  formula: 'nC5H12', mw: 72.150,  tc: 469.7,  pc: 3370,  omega: 0.2515, tb: 309.2, sg: 0.631 };
const nC6: PureComponent = { name: 'n-Hexane',   formula: 'C6H14',  mw: 86.177,  tc: 507.6,  pc: 3025,  omega: 0.3013, tb: 341.9, sg: 0.664 };
const nC7: PureComponent = { name: 'n-Heptane',  formula: 'C7H16',  mw: 100.204, tc: 540.2,  pc: 2740,  omega: 0.3495, tb: 371.6, sg: 0.688 };
const nC8: PureComponent = { name: 'n-Octane',   formula: 'C8H18',  mw: 114.231, tc: 568.7,  pc: 2490,  omega: 0.3996, tb: 398.8, sg: 0.707 };
const nC9: PureComponent = { name: 'n-Nonane',   formula: 'C9H20',  mw: 128.258, tc: 594.6,  pc: 2290,  omega: 0.4435, tb: 424.0, sg: 0.722 };
const nC10:PureComponent = { name: 'n-Decane',   formula: 'C10H22', mw: 142.285, tc: 617.7,  pc: 2110,  omega: 0.4923, tb: 447.3, sg: 0.734 };

// ── Hidrocarburos pesados C11-C20 (pseudo-componentes) ─────
const nC11:PureComponent = { name: 'n-C11', formula: 'C11H24', mw: 156.312, tc: 639.0, pc: 1950, omega: 0.5390, tb: 469.1, sg: 0.745 };
const nC12:PureComponent = { name: 'n-C12', formula: 'C12H26', mw: 170.338, tc: 658.0, pc: 1820, omega: 0.5764, tb: 489.5, sg: 0.751 };
const nC13:PureComponent = { name: 'n-C13', formula: 'C13H28', mw: 184.365, tc: 675.0, pc: 1680, omega: 0.6174, tb: 508.6, sg: 0.760 };
const nC14:PureComponent = { name: 'n-C14', formula: 'C14H30', mw: 198.392, tc: 693.0, pc: 1570, omega: 0.6430, tb: 526.7, sg: 0.767 };
const nC15:PureComponent = { name: 'n-C15', formula: 'C15H32', mw: 212.419, tc: 708.0, pc: 1480, omega: 0.6863, tb: 543.8, sg: 0.774 };
const nC16:PureComponent = { name: 'n-C16', formula: 'C16H34', mw: 226.446, tc: 723.0, pc: 1400, omega: 0.7174, tb: 560.0, sg: 0.780 };
const nC17:PureComponent = { name: 'n-C17', formula: 'C17H36', mw: 240.473, tc: 736.0, pc: 1340, omega: 0.7697, tb: 575.2, sg: 0.785 };
const nC18:PureComponent = { name: 'n-C18', formula: 'C18H38', mw: 254.500, tc: 747.0, pc: 1270, omega: 0.8114, tb: 589.5, sg: 0.790 };
const nC19:PureComponent = { name: 'n-C19', formula: 'C19H40', mw: 268.527, tc: 758.0, pc: 1210, omega: 0.8522, tb: 603.1, sg: 0.794 };
const nC20:PureComponent = { name: 'n-C20', formula: 'C20H42', mw: 282.553, tc: 768.0, pc: 1160, omega: 0.9069, tb: 616.9, sg: 0.799 };

// ── Pesados C21-C36+ ──────────────────────────────────────
const nC21:PureComponent = { name: 'n-C21', formula: 'C21H44', mw: 296.580, tc: 778.0, pc: 1110, omega: 0.9420, tb: 629.7, sg: 0.803 };
const nC22:PureComponent = { name: 'n-C22', formula: 'C22H46', mw: 310.607, tc: 787.0, pc: 1060, omega: 0.9730, tb: 641.8, sg: 0.807 };
const nC23:PureComponent = { name: 'n-C23', formula: 'C23H48', mw: 324.634, tc: 796.0, pc: 1020, omega: 1.0019, tb: 653.3, sg: 0.811 };
const nC24:PureComponent = { name: 'n-C24', formula: 'C24H50', mw: 338.661, tc: 804.0, pc: 980,  omega: 1.0280, tb: 664.5, sg: 0.815 };
const nC25:PureComponent = { name: 'n-C25', formula: 'C25H52', mw: 352.688, tc: 812.0, pc: 950,  omega: 1.0530, tb: 675.1, sg: 0.818 };
const nC26:PureComponent = { name: 'n-C26', formula: 'C26H54', mw: 366.715, tc: 819.0, pc: 920,  omega: 1.0850, tb: 685.4, sg: 0.821 };
const nC27:PureComponent = { name: 'n-C27', formula: 'C27H56', mw: 380.742, tc: 826.0, pc: 889,  omega: 1.1106, tb: 694.5, sg: 0.824 };
const nC28:PureComponent = { name: 'n-C28', formula: 'C28H58', mw: 394.769, tc: 832.0, pc: 862,  omega: 1.1400, tb: 704.8, sg: 0.827 };
const nC29:PureComponent = { name: 'n-C29', formula: 'C29H60', mw: 408.796, tc: 838.0, pc: 836,  omega: 1.1750, tb: 714.0, sg: 0.830 };
const nC30:PureComponent = { name: 'n-C30', formula: 'C30H62', mw: 422.823, tc: 844.0, pc: 812,  omega: 1.2064, tb: 722.5, sg: 0.832 };
const nC31:PureComponent = { name: 'n-C31', formula: 'C31H64', mw: 436.850, tc: 849.0, pc: 790,  omega: 1.2330, tb: 731.0, sg: 0.835 };
const nC32:PureComponent = { name: 'n-C32', formula: 'C32H66', mw: 450.877, tc: 855.0, pc: 770,  omega: 1.2620, tb: 739.0, sg: 0.837 };
const nC33:PureComponent = { name: 'n-C33', formula: 'C33H68', mw: 464.904, tc: 860.0, pc: 750,  omega: 1.2900, tb: 746.5, sg: 0.839 };
const nC34:PureComponent = { name: 'n-C34', formula: 'C34H70', mw: 478.931, tc: 865.0, pc: 732,  omega: 1.3170, tb: 754.0, sg: 0.841 };
const nC35:PureComponent = { name: 'n-C35', formula: 'C35H72', mw: 492.958, tc: 869.0, pc: 715,  omega: 1.3450, tb: 761.0, sg: 0.843 };
const C36P:PureComponent = { name: 'C36+',  formula: 'C36+',   mw: 520.000, tc: 878.0, pc: 690,  omega: 1.4000, tb: 775.0, sg: 0.850 };

/** Todos los componentes en orden estándar */
export const COMPONENT_DB: PureComponent[] = [
  N2, CO2, H2S,
  C1, C2, C3, iC4, nC4, iC5, nC5,
  nC6, nC7, nC8, nC9, nC10,
  nC11, nC12, nC13, nC14, nC15,
  nC16, nC17, nC18, nC19, nC20,
  nC21, nC22, nC23, nC24, nC25,
  nC26, nC27, nC28, nC29, nC30,
  nC31, nC32, nC33, nC34, nC35,
  C36P,
  H2O,
];

/** Mapa nombre → índice para acceso rápido */
export const COMP_INDEX = new Map<string, number>(
  COMPONENT_DB.map((c, i) => [c.name, i]),
);

/** Buscar componente por nombre o fórmula */
export function findComponent(key: string): PureComponent | undefined {
  return COMPONENT_DB.find(c => c.name === key || c.formula === key);
}

/**
 * Parámetros de interacción binaria (kij) para PR/SRK.
 * Simétricos: kij = kji. Los no listados se asumen 0.
 * Fuente: GPSA Engineering Data Book, Tabla 25-9.
 */
export const BIP: Record<string, Record<string, number>> = {
  'CH4':  { 'C2H6': 0.0, 'C3H8': 0.0, 'CO2': 0.0919, 'H2S': 0.08, 'N2': 0.0311, 'H2O': 0.50 },
  'C2H6': { 'C3H8': 0.0, 'CO2': 0.1322, 'H2S': 0.085, 'N2': 0.0515, 'H2O': 0.50 },
  'C3H8': { 'CO2': 0.1241, 'H2S': 0.09, 'N2': 0.0852, 'H2O': 0.50 },
  'CO2':  { 'H2S': 0.0974, 'N2': -0.017, 'H2O': 0.12 },
  'H2S':  { 'N2': 0.17, 'H2O': 0.040 },
  'N2':   { 'H2O': 0.50 },
};

/** Obtener kij simétrico; retorna 0 si no hay dato */
export function getKij(formulaI: string, formulaJ: string): number {
  return BIP[formulaI]?.[formulaJ] ?? BIP[formulaJ]?.[formulaI] ?? 0;
}

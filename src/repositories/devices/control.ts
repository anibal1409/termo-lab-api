// Lógica pura del módulo de dispositivos: sin E/S, para poder probarla sin hardware.

export enum ChannelType {
  DIGITAL_OUT = 'digital_out',
  PWM = 'pwm',
  SERVO = 'servo',
  DIGITAL_IN = 'digital_in',
  ANALOG_IN = 'analog_in',
  MAX6675 = 'max6675', // pins: [cs, sck, so]
  DS18B20 = 'ds18b20', // pins: [pin, index?]
  MAX31865 = 'max31865', // pins: [cs, di, do, clk, hilos?]
}

export const OUTPUT_TYPES = [
  ChannelType.DIGITAL_OUT,
  ChannelType.PWM,
  ChannelType.SERVO,
];

const PIN_COUNT: Record<ChannelType, number> = {
  [ChannelType.DIGITAL_OUT]: 1,
  [ChannelType.PWM]: 1,
  [ChannelType.SERVO]: 1,
  [ChannelType.DIGITAL_IN]: 1,
  [ChannelType.ANALOG_IN]: 1,
  [ChannelType.MAX6675]: 3,
  [ChannelType.DS18B20]: 1,
  [ChannelType.MAX31865]: 4,
};

const RANGE: Partial<Record<ChannelType, [number, number]>> = {
  [ChannelType.DIGITAL_OUT]: [0, 1],
  [ChannelType.PWM]: [0, 255],
  [ChannelType.SERVO]: [0, 180],
};

export const PIN_REGEX = /^[AD]?\d{1,2}$/i;

// Todo comando que llega al puerto debe pasar este filtro (sin saltos de línea ni basura).
export const COMMAND_REGEX =
  /^[A-Z]{2,5}( ([AD]?\d{1,3}|IN|OUT|PULLUP)){0,5}$/i;

export interface ChannelLike {
  type: ChannelType;
  pins: string[];
  pullup?: boolean;
  factor?: number;
  offset?: number;
}

export function isOutput(type: ChannelType) {
  return OUTPUT_TYPES.includes(type);
}

export function outputRange(type: ChannelType): [number, number] {
  const r = RANGE[type];
  if (!r) throw new Error(`El canal ${type} no es de salida`);
  return r;
}

/** Devuelve un mensaje de error o null si los pines son válidos para el tipo. */
export function validatePins(type: ChannelType, pins: string[]): string | null {
  const need = PIN_COUNT[type];
  if (!need) return `Tipo desconocido: ${type}`;
  if (pins.length < need) return `${type} necesita ${need} pines`;
  const bad = pins.find((p) => !PIN_REGEX.test(p));
  if (bad) return `Pin inválido: ${bad}`;
  if (type === ChannelType.ANALOG_IN && !/^A/i.test(pins[0]))
    return 'analog_in requiere un pin A0-A5';
  return null;
}

/** Comandos a enviar al conectar, para dejar el pin en el modo correcto. */
export function setupCommands(ch: ChannelLike): string[] {
  const p = ch.pins[0];
  switch (ch.type) {
    case ChannelType.DIGITAL_OUT:
    case ChannelType.PWM:
      return [
        `MODE ${p} OUT`,
        `${ch.type === ChannelType.PWM ? 'PWM' : 'WRITE'} ${p} 0`,
      ];
    case ChannelType.DIGITAL_IN:
      return [`MODE ${p} ${ch.pullup ? 'PULLUP' : 'IN'}`, `WATCH ${p} 1`];
    case ChannelType.ANALOG_IN:
      return [`MODE ${p} IN`];
    default:
      return [];
  }
}

export function readCommand(ch: ChannelLike): string {
  const [a, b, c, d, e] = ch.pins;
  switch (ch.type) {
    case ChannelType.DIGITAL_IN:
    case ChannelType.ANALOG_IN:
      return `READ ${a}`;
    case ChannelType.MAX6675:
      return `TC ${a} ${b} ${c}`;
    case ChannelType.DS18B20:
      return `DS ${a} ${b ?? 0}`;
    case ChannelType.MAX31865:
      return `PT ${a} ${b} ${c} ${d} ${e ?? 3}`;
    default:
      throw new Error(`El canal ${ch.type} no se puede leer`);
  }
}

export function writeCommand(ch: ChannelLike, value: number): string {
  const [min, max] = outputRange(ch.type);
  const v = Math.round(Math.min(max, Math.max(min, value)));
  const op = { digital_out: 'WRITE', pwm: 'PWM', servo: 'SERVO' }[ch.type];
  return `${op} ${ch.pins[0]} ${v}`;
}

/** "VAL A0 512" o "VAL 23.75" -> número crudo. */
export function parseValue(response: string): number {
  const v = parseFloat(response.trim().split(/\s+/).pop() ?? '');
  if (!response.startsWith('VAL') || Number.isNaN(v)) {
    throw new Error(`Respuesta inesperada: ${response}`);
  }
  return v;
}

/** Valor de ingeniería = crudo * factor + offset (calibración por canal). */
export function calibrate(ch: ChannelLike, raw: number): number {
  return raw * (ch.factor ?? 1) + (ch.offset ?? 0);
}

// ---------- Reglas: "si <canal> > X entonces <salida> = Y" ----------

export interface RuleLike {
  operator: '>' | '<';
  threshold: number;
  hysteresis: number;
}

/**
 * Devuelve el nuevo estado activo de la regla. Con histéresis: una regla ">" activa
 * en value > threshold y solo se desactiva cuando value < threshold - hysteresis.
 */
export function evalRule(
  rule: RuleLike,
  value: number,
  active: boolean,
): boolean {
  const h = Math.abs(rule.hysteresis ?? 0);
  if (rule.operator === '>') {
    return active ? value >= rule.threshold - h : value > rule.threshold;
  }
  return active ? value <= rule.threshold + h : value < rule.threshold;
}

// ---------- PID ----------

export interface PidConfig {
  setpoint: number;
  kp: number;
  ki: number;
  kd: number;
  outMin: number;
  outMax: number;
}

export interface PidState {
  integral: number;
  lastInput?: number;
}

/** Un paso de PID con anti-windup y derivada sobre la medida (sin "kick" al cambiar consigna). */
export function pidStep(
  cfg: PidConfig,
  state: PidState,
  input: number,
  dtSec: number,
): { output: number; state: PidState } {
  const error = cfg.setpoint - input;
  const clamp = (v: number) => Math.min(cfg.outMax, Math.max(cfg.outMin, v));
  const integral = clamp(state.integral + cfg.ki * error * dtSec);
  const derivative =
    state.lastInput === undefined || dtSec <= 0
      ? 0
      : (input - state.lastInput) / dtSec;
  const output = clamp(cfg.kp * error + integral - cfg.kd * derivative);
  return { output, state: { integral, lastInput: input } };
}

/**
 * Salida digital (relé/SSR) controlada por PID: modulación por ventana de tiempo.
 * output en [outMin, outMax] -> encendido durante esa fracción de cada ventana.
 */
export function timeProportional(
  output: number,
  cfg: Pick<PidConfig, 'outMin' | 'outMax'>,
  nowMs: number,
  windowMs: number,
): 0 | 1 {
  const duty = (output - cfg.outMin) / (cfg.outMax - cfg.outMin || 1);
  return (nowMs % windowMs) / windowMs < duty ? 1 : 0;
}

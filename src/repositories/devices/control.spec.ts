import {
  calibrate,
  ChannelType,
  COMMAND_REGEX,
  evalRule,
  parseValue,
  pidStep,
  readCommand,
  setupCommands,
  timeProportional,
  validatePins,
  writeCommand,
} from './control';
import { pinNumber } from './devices.service';

describe('control', () => {
  it('filtra comandos', () => {
    for (const c of [
      'PING',
      'MODE 7 OUT',
      'WRITE D13 1',
      'READ A0',
      'TC 10 13 12',
      'DS 4 0',
      'PT 10 11 12 13 3',
    ])
      expect(COMMAND_REGEX.test(c)).toBe(true);
    for (const c of [
      '',
      'READ A0\nWRITE 7 1',
      'WRITE 7 -1',
      'MODE 7 X',
      'FOO; rm',
    ])
      expect(COMMAND_REGEX.test(c)).toBe(false);
  });

  it('valida pines por tipo', () => {
    expect(validatePins(ChannelType.MAX6675, ['10', '13'])).toMatch(/3 pines/);
    expect(validatePins(ChannelType.ANALOG_IN, ['7'])).toMatch(/A0-A5/);
    expect(validatePins(ChannelType.PWM, ['X9'])).toMatch(/inválido/);
    expect(validatePins(ChannelType.MAX6675, ['10', '13', '12'])).toBeNull();
  });

  it('genera comandos', () => {
    expect(
      setupCommands({
        type: ChannelType.DIGITAL_IN,
        pins: ['2'],
        pullup: true,
      }),
    ).toEqual(['MODE 2 PULLUP', 'WATCH 2 1']);
    expect(
      readCommand({
        type: ChannelType.MAX31865,
        pins: ['10', '11', '12', '13'],
      }),
    ).toBe('PT 10 11 12 13 3');
    expect(readCommand({ type: ChannelType.DS18B20, pins: ['4'] })).toBe(
      'DS 4 0',
    );
    expect(writeCommand({ type: ChannelType.PWM, pins: ['9'] }, 300)).toBe(
      'PWM 9 255',
    );
    expect(writeCommand({ type: ChannelType.SERVO, pins: ['6'] }, 90.4)).toBe(
      'SERVO 6 90',
    );
    expect(() =>
      writeCommand({ type: ChannelType.ANALOG_IN, pins: ['A0'] }, 1),
    ).toThrow();
  });

  it('parsea y calibra', () => {
    expect(parseValue('VAL A0 512')).toBe(512);
    expect(parseValue('VAL 23.75')).toBe(23.75);
    expect(() => parseValue('OK')).toThrow();
    // 0-1023 -> 0-10 bar
    expect(
      calibrate(
        {
          type: ChannelType.ANALOG_IN,
          pins: ['A0'],
          factor: 10 / 1023,
          offset: 0,
        },
        1023,
      ),
    ).toBeCloseTo(10);
  });

  it('reglas con histéresis', () => {
    const r = { operator: '>' as const, threshold: 80, hysteresis: 2 };
    expect(evalRule(r, 81, false)).toBe(true);
    expect(evalRule(r, 79, true)).toBe(true); // dentro de la histéresis
    expect(evalRule(r, 77, true)).toBe(false);
    expect(evalRule({ ...r, operator: '<' }, 79, false)).toBe(true);
  });

  it('PID: empuja hacia la consigna y respeta límites', () => {
    const cfg = { setpoint: 60, kp: 10, ki: 1, kd: 0, outMin: 0, outMax: 255 };
    let st = { integral: 0 } as { integral: number; lastInput?: number };
    const cold = pidStep(cfg, st, 20, 1);
    expect(cold.output).toBe(255);
    expect(cold.state.integral).toBeLessThanOrEqual(255); // anti-windup
    const hot = pidStep(cfg, { integral: 0 }, 90, 1);
    expect(hot.output).toBe(0);
    st = pidStep(cfg, { integral: 0 }, 59, 1).state;
    expect(pidStep(cfg, st, 59.5, 1).output).toBeGreaterThan(0);
  });

  it('ventana de tiempo para relés', () => {
    const cfg = { outMin: 0, outMax: 100 };
    expect(timeProportional(30, cfg, 2000, 10000)).toBe(1);
    expect(timeProportional(30, cfg, 4000, 10000)).toBe(0);
    expect(timeProportional(0, cfg, 0, 10000)).toBe(0);
  });

  it('numera pines como el firmware', () => {
    expect(pinNumber('A0')).toBe(14);
    expect(pinNumber('D7')).toBe(7);
    expect(pinNumber('7')).toBe(7);
  });
});

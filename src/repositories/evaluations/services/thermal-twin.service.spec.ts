import {
  pilotMass,
  twinStep,
  simulateTwin,
  calibrate,
  TwinParams,
  TimeSeries,
} from './thermal-twin.service';

describe('Thermal Twin', () => {
  const params: TwinParams = {
    mass: 100,       // lb
    cp: 1.0,         // BTU/(lb·°F)
    eta: 0.9,
    ua: 10,          // BTU/(h·°F)
    heaterPower: 5000,
  };

  describe('pilotMass', () => {
    it('calculates cylindrical volume × water density', () => {
      const m = pilotMass(1, 2); // 1ft diameter, 2ft long
      const expected = Math.PI * 0.25 * 2 * 62.4;
      expect(m).toBeCloseTo(expected, 2);
    });
  });

  describe('twinStep', () => {
    it('temperature rises with heater on and falls with heater off', () => {
      const Trise = twinStep(params, 75, 30, true, 60);
      expect(Trise).toBeGreaterThan(75);

      const Tfall = twinStep(params, 120, 30, false, 60);
      expect(Tfall).toBeLessThan(120);
    });

    it('matches analytical solution for constant power', () => {
      // With UA=0 (no losses): T = T0 + (eta*P*dt)/(m*cp)
      const noLoss = { ...params, ua: 0 };
      const dt = 3600; // 1 hour
      const T = twinStep(noLoss, 75, 30, true, dt);
      const expected = 75 + (noLoss.eta * noLoss.heaterPower * 1) / (noLoss.mass * noLoss.cp);
      expect(T).toBeCloseTo(expected, 4);
    });
  });

  describe('simulateTwin', () => {
    it('returns same length as realTempSeries', () => {
      const real: TimeSeries[] = [
        { t: 0, value: 75 },
        { t: 60, value: 76 },
        { t: 120, value: 77 },
      ];
      const heater: TimeSeries[] = [{ t: 0, value: 1 }];
      const ambient: TimeSeries[] = [{ t: 0, value: 30 }];

      const pts = simulateTwin(params, 75, heater, ambient, real);
      expect(pts).toHaveLength(3);
      expect(pts[0].real).toBe(75);
      expect(pts[0].simulated).toBe(75);
    });
  });

  describe('calibrate', () => {
    it('recovers known eta and UA from synthetic data', () => {
      const trueEta = 0.85;
      const trueUA = 8;
      const trueParams: TwinParams = {
        mass: 100, cp: 1.0, eta: trueEta, ua: trueUA, heaterPower: 5000,
      };

      // Generate synthetic data: 30 min heating then 30 min cooling
      const real: TimeSeries[] = [];
      const heater: TimeSeries[] = [];
      const ambient: TimeSeries[] = [{ t: 0, value: 30 }];
      let T = 75;
      const dt = 60; // 1 min steps
      for (let t = 0; t <= 3600; t += dt) {
        const on = t < 1800;
        heater.push({ t, value: on ? 1 : 0 });
        real.push({ t, value: T });
        T = twinStep(trueParams, T, 30, on, dt);
      }

      const result = calibrate(100, 1.0, 5000, real, ambient, heater);
      expect(result.eta).toBeCloseTo(trueEta, 1);
      expect(result.ua).toBeCloseTo(trueUA, 0);
      expect(result.rmse).toBeLessThan(1);
    });

    it('RMSE after calibration < RMSE before', () => {
      const trueParams: TwinParams = {
        mass: 100, cp: 1.0, eta: 0.8, ua: 12, heaterPower: 5000,
      };
      const real: TimeSeries[] = [];
      const heater: TimeSeries[] = [];
      const ambient: TimeSeries[] = [{ t: 0, value: 30 }];
      let T = 75;
      for (let t = 0; t <= 3600; t += 60) {
        heater.push({ t, value: t < 1800 ? 1 : 0 });
        real.push({ t, value: T });
        T = twinStep(trueParams, T, 30, t < 1800, 60);
      }

      // Simulate with wrong params
      const wrongParams: TwinParams = {
        mass: 100, cp: 1.0, eta: 0.5, ua: 2, heaterPower: 5000,
      };
      const wrongPts = simulateTwin(wrongParams, 75, heater, ambient, real);
      const wrongRmse = Math.sqrt(
        wrongPts.reduce((s, p) => s + p.error ** 2, 0) / wrongPts.length,
      );

      const cal = calibrate(100, 1.0, 5000, real, ambient, heater);
      expect(cal.rmse).toBeLessThan(wrongRmse);
    });
  });
});

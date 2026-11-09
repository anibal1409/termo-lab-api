import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTrialAndDeviceData1794021872973 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 1. Dispositivo piloto ────────────────────────────────
    const [device] = await queryRunner.query(
      `INSERT INTO "devices" ("name", "path", "baudRate", "autoConnect")
       VALUES ('Piloto Lab', '/dev/ttyUSB_SEED', 115200, false)
       RETURNING id`,
    );
    const deviceId = device.id;

    // ── 2. Canales ───────────────────────────────────────────
    const channels: {
      name: string;
      type: string;
      pins: string;
      unit: string;
    }[] = [
      {
        name: 'Temp. Baño (MAX6675)',
        type: 'max6675',
        pins: '10,13,12',
        unit: '°F',
      },
      {
        name: 'Temp. Ambiente (DS18B20)',
        type: 'ds18b20',
        pins: '4,0',
        unit: '°F',
      },
      { name: 'Calentador (PWM)', type: 'pwm', pins: '9', unit: '' },
      { name: 'Nivel HC-SR04', type: 'analog_in', pins: '5', unit: 'cm' },
    ];

    const channelIds: number[] = [];
    for (const ch of channels) {
      const [row] = await queryRunner.query(
        `INSERT INTO "device_channels" ("deviceId", "name", "type", "pins", "unit", "pollMs")
         VALUES ($1, $2, $3, $4, $5, 2000)
         RETURNING id`,
        [deviceId, ch.name, ch.type, ch.pins, ch.unit],
      );
      channelIds.push(row.id);
    }

    const [bathChId, ambientChId, heaterChId, levelChId] = channelIds;

    // ── 3. PID loop de ejemplo ───────────────────────────────
    const [pid] = await queryRunner.query(
      `INSERT INTO "pid_loops"
         ("name", "inputChannelId", "outputChannelId", "setpoint", "kp", "ki", "kd", "outMin", "outMax", "windowMs", "enabled")
       VALUES ('PID Baño → Calentador', $1, $2, 140, 2.5, 0.1, 0.5, 0, 255, 10000, false)
       RETURNING id`,
      [bathChId, heaterChId],
    );

    // ── 4. Regla de seguridad de ejemplo ─────────────────────
    const [rule] = await queryRunner.query(
      `INSERT INTO "device_rules"
         ("name", "sourceChannelId", "operator", "threshold", "hysteresis", "targetChannelId", "onValue", "offValue", "enabled")
       VALUES ('Apagar calentador >180°F', $1, '>', 180, 2, $2, 0, NULL, true)
       RETURNING id`,
      [bathChId, heaterChId],
    );

    // ── 5. Lecturas sintéticas: 60 min calentamiento + 30 min enfriamiento ──
    const startTime = new Date('2026-10-01T10:00:00Z');
    const eta = 0.85;
    const ua = 8;
    const mass = 100;
    const cp = 1.0;
    const heaterPower = 5000;
    const ambientTemp = 85; // °F

    let T = 80; // °F inicial
    const bathReadings: string[] = [];
    const ambientReadings: string[] = [];
    const heaterReadings: string[] = [];
    const commandLogs: string[] = [];
    const dtSec = 60; // 1 lectura por minuto

    for (let min = 0; min <= 90; min++) {
      const at = new Date(startTime.getTime() + min * 60_000).toISOString();
      const heaterOn = min < 60;

      bathReadings.push(`(${bathChId}, ${T.toFixed(2)}, '${at}')`);
      ambientReadings.push(`(${ambientChId}, ${ambientTemp}, '${at}')`);
      heaterReadings.push(`(${heaterChId}, ${heaterOn ? 255 : 0}, '${at}')`);

      // Command log al encender/apagar
      if (min === 0) {
        commandLogs.push(
          `(${deviceId}, ${heaterChId}, NULL, 'rule', 'WRITE 9 255', 'OK', '${at}')`,
        );
      }
      if (min === 60) {
        commandLogs.push(
          `(${deviceId}, ${heaterChId}, NULL, 'rule', 'WRITE 9 0', 'OK', '${at}')`,
        );
      }

      // Euler step: dT/dt = (eta*P*on - UA*(T-Tamb)) / (m*cp)
      const powerIn = heaterOn ? eta * heaterPower : 0;
      const loss = ua * (T - ambientTemp);
      const dTdtPerHour = (powerIn - loss) / (mass * cp);
      T += dTdtPerHour * (dtSec / 3600);
    }

    // Batch insert readings
    if (bathReadings.length) {
      await queryRunner.query(
        `INSERT INTO "channel_readings" ("channelId", "value", "at") VALUES ${bathReadings.join(',')}`,
      );
      await queryRunner.query(
        `INSERT INTO "channel_readings" ("channelId", "value", "at") VALUES ${ambientReadings.join(',')}`,
      );
      await queryRunner.query(
        `INSERT INTO "channel_readings" ("channelId", "value", "at") VALUES ${heaterReadings.join(',')}`,
      );
    }

    // Command logs
    if (commandLogs.length) {
      await queryRunner.query(
        `INSERT INTO "device_command_logs" ("deviceId", "channelId", "userId", "source", "command", "response", "at")
         VALUES ${commandLogs.join(',')}`,
      );
    }

    // ── 6. Ensayo completado ─────────────────────────────────
    const endTime = new Date(startTime.getTime() + 90 * 60_000).toISOString();

    const [trial] = await queryRunner.query(
      `INSERT INTO "trials"
         ("name", "pilotDiameter", "pilotLength", "heaterPower",
          "bathTempChannelId", "ambientTempChannelId", "heaterChannelId",
          "levelChannelIds", "pidLoopId", "ruleIds",
          "state", "startedAt", "endedAt", "notes",
          "calibratedEta", "calibratedUA", "calibrationRmse")
       VALUES
         ('Ensayo Morichal 18°API', 0.5, 2, ${heaterPower},
          ${bathChId}, ${ambientChId}, ${heaterChId},
          '${levelChId}', ${pid.id}, '${rule.id}',
          'completed', '${startTime.toISOString()}', '${endTime}',
          'Ensayo seed: 60 min calentamiento + 30 min enfriamiento, crudo 18°API',
          ${eta}, ${ua}, 0.42)
       RETURNING id`,
    );

    // ── 7. Muestras manuales ─────────────────────────────────
    const samples = [
      { label: 'BSW entrada', value: 25, unit: '%', minOffset: 0 },
      { label: 'BSW salida (30 min)', value: 8.2, unit: '%', minOffset: 30 },
      { label: 'BSW salida (60 min)', value: 1.8, unit: '%', minOffset: 60 },
      { label: 'Viscosidad salida', value: 12.5, unit: 'cSt', minOffset: 60 },
    ];

    const sampleValues = samples
      .map((s) => {
        const at = new Date(
          startTime.getTime() + s.minOffset * 60_000,
        ).toISOString();
        return `(${trial.id}, '${s.label}', ${s.value}, '${s.unit}', '${at}')`;
      })
      .join(',');

    await queryRunner.query(
      `INSERT INTO "trial_samples" ("trialId", "label", "value", "unit", "at")
       VALUES ${sampleValues}`,
    );

    // ── 8. Segundo ensayo (draft) para probar lifecycle ──────
    await queryRunner.query(
      `INSERT INTO "trials"
         ("name", "pilotDiameter", "pilotLength", "heaterPower",
          "bathTempChannelId", "ambientTempChannelId", "heaterChannelId",
          "levelChannelIds", "pidLoopId", "ruleIds",
          "state", "notes")
       VALUES
         ('Ensayo Crudo Pesado 12°API', 0.5, 2, ${heaterPower},
          ${bathChId}, ${ambientChId}, ${heaterChId},
          '${levelChId}', ${pid.id}, '${rule.id}',
          'draft', 'Ensayo borrador para pruebas de lifecycle start/stop')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "trial_samples"`);
    await queryRunner.query(`DELETE FROM "trials"`);
    await queryRunner.query(
      `DELETE FROM "device_command_logs" WHERE "deviceId" IN (SELECT id FROM "devices" WHERE "path" = '/dev/ttyUSB_SEED')`,
    );
    await queryRunner.query(
      `DELETE FROM "channel_readings" WHERE "channelId" IN (SELECT id FROM "device_channels" WHERE "deviceId" IN (SELECT id FROM "devices" WHERE "path" = '/dev/ttyUSB_SEED'))`,
    );
    await queryRunner.query(
      `DELETE FROM "pid_loops" WHERE "name" = 'PID Baño → Calentador'`,
    );
    await queryRunner.query(
      `DELETE FROM "device_rules" WHERE "name" = 'Apagar calentador >180°F'`,
    );
    await queryRunner.query(
      `DELETE FROM "device_channels" WHERE "deviceId" IN (SELECT id FROM "devices" WHERE "path" = '/dev/ttyUSB_SEED')`,
    );
    await queryRunner.query(
      `DELETE FROM "devices" WHERE "path" = '/dev/ttyUSB_SEED'`,
    );
  }
}

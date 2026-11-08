import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Seed masiva para todos los módulos con datos de campo realistas.
 * Crudos venezolanos típicos: Morichal (18°API), Mesa (30°API),
 * Furrial (22°API), Bare (10°API), Hamaca (8.5°API).
 */
export class SeedAllModules1794108000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ══════════════════════════════════════════════════════════
    // 1. USUARIOS adicionales
    // ══════════════════════════════════════════════════════════
    // Passwords = bcrypt("12345678") — misma que los existentes
    const existingUser = await queryRunner.query(
      `SELECT password FROM users WHERE id = 1`,
    );
    const hash = existingUser[0].password;

    const newUsers = await queryRunner.query(`
      INSERT INTO users (name, email, password, role, "birthDate") VALUES
        ('Ing. María González', 'maria.gonzalez@termolab.com', '${hash}', 'admin', '1990-03-15'),
        ('Ing. Carlos Pérez', 'carlos.perez@termolab.com', '${hash}', 'operator', '1988-07-22'),
        ('Ing. Ana Rodríguez', 'ana.rodriguez@termolab.com', '${hash}', 'operator', '1992-11-08'),
        ('Ing. Luis Martínez', 'luis.martinez@termolab.com', '${hash}', 'operator', '1985-01-30')
      RETURNING id
    `);
    const mariaId = newUsers[0].id;
    const carlosId = newUsers[1].id;

    // ══════════════════════════════════════════════════════════
    // 2. TRATADORES — crudos representativos de la FPO
    // ══════════════════════════════════════════════════════════
    await queryRunner.query(`
      INSERT INTO treatments
        (name, description, type, "totalFlow", "waterFraction",
         "inputTemperature", "treatmentTemperature", "ambientTemperature",
         "oilRetentionTime", "waterRetentionTime", "windSpeed", "apiGravity",
         "calculatedOilFlow", "calculatedWaterFlow",
         "oilRetentionVolume", "waterRetentionVolume",
         "requiredHeat", "heatLoss", "totalHeat",
         "selectedDiameter", "selectedLength", "designPressure", created_by)
      VALUES
        -- Crudo Mesa 30°API — ligero, fácil
        ('Tratador Vertical Mesa 30°API - 300 bpd',
         'Crudo liviano, baja emulsión, tratamiento sencillo',
         'vertical', 300, 10, 80, 120, 35, 45, 20, 10, 30,
         270, 30, 8.44, 0.42, 125000, 42000, 167000,
         2.5, 8, 50, ${mariaId}),

        -- Crudo Furrial 22°API — mediano
        ('Tratador Horizontal Furrial 22°API - 800 bpd',
         'Crudo mediano con emulsión moderada',
         'horizontal', 800, 25, 72, 145, 28, 75, 35, 12, 22,
         600, 200, 31.25, 4.86, 420000, 145000, 565000,
         3.5, 14, 50, ${mariaId}),

        -- Crudo Bare 10°API — extrapesado
        ('Tratador Horizontal Bare 10°API - 1500 bpd',
         'Crudo extrapesado, alta viscosidad, requiere temperatura elevada',
         'horizontal', 1500, 40, 65, 180, 25, 120, 60, 8, 10,
         900, 600, 75.0, 25.0, 1250000, 380000, 1630000,
         6, 20, 75, ${carlosId}),

        -- Crudo Hamaca 8.5°API — el más difícil
        ('Tratador Horizontal Hamaca 8.5°API - 2000 bpd',
         'Crudo ultrapesado, emulsión tenaz, diseño extremo',
         'horizontal', 2000, 50, 60, 200, 22, 150, 75, 5, 8.5,
         1000, 1000, 104.17, 52.08, 2100000, 620000, 2720000,
         8, 25, 100, ${carlosId}),

        -- Morichal 18°API con diseño marginal (para probar diagnose)
        ('Tratador Marginal Morichal 18°API - 600 bpd',
         'Diseño subdimensionado para demostrar diagnóstico de fallas',
         'horizontal', 600, 30, 70, 135, 30, 55, 25, 15, 18,
         420, 180, 16.04, 3.13, 310000, 108000, 418000,
         3, 8, 50, ${mariaId}),

        -- Diseño sobredimensionado (para probar que cumple todo)
        ('Tratador Premium Morichal 18°API - 400 bpd',
         'Diseño generoso, cumple todos los criterios con holgura',
         'horizontal', 400, 15, 75, 150, 30, 90, 45, 10, 18,
         340, 60, 21.25, 1.88, 210000, 95000, 305000,
         5, 18, 50, ${carlosId})
    `);

    // ══════════════════════════════════════════════════════════
    // 3. TRATADORES EXTERNOS
    // ══════════════════════════════════════════════════════════
    await queryRunner.query(`
      INSERT INTO external_treatments
        (name, type, "totalFlow", "waterFraction", "apiGravity", "oilRetentionTime",
         diameter, length, "inletTemperature", "ambientTemperature", "operatingPressure")
      VALUES
        ('Tratador Campo El Furrial - Planta Norte',
         'horizontal', 1200, 22, 22, 80,
         4.5, 16, 75, 30, 50),
        ('Tratador Campo Bare - Estación 4',
         'horizontal', 2500, 45, 10, 130,
         7, 22, 60, 25, 75),
        ('Gun Barrel Mesa - Estación Central',
         'vertical', 500, 8, 30, 40,
         3, 10, 85, 35, 50),
        ('Tratador Campo Hamaca - PDVSA',
         'horizontal', 3000, 55, 8.5, 160,
         10, 30, 55, 22, 100)
    `);

    // ══════════════════════════════════════════════════════════
    // 4. EVALUACIONES con cálculos térmicos
    // ══════════════════════════════════════════════════════════
    // Obtener IDs de treatments nuevos
    const treatments = await queryRunner.query(
      `SELECT id, name, "apiGravity" FROM treatments ORDER BY id`,
    );
    const extTreatments = await queryRunner.query(
      `SELECT id, name FROM external_treatments ORDER BY id`,
    );

    const evalInserts: string[] = [];
    const criteriaInserts: string[] = [];
    let evalId = 4; // ya hay 3

    // Criterios API-12L reales
    const api12LCriteria = [
      { name: 'Tiempo de retención de petróleo', desc: 'Mínimo 60 min según API-12L sección 4.5', unit: 'min', required: 60, critical: true, weight: 25 },
      { name: 'Porcentaje de deshidratación', desc: 'Mínimo 85% para cumplir especificación de exportación', unit: '%', required: 85, critical: true, weight: 20 },
      { name: 'Eficiencia de separación', desc: 'Mínimo 85% de eficiencia en separación gravitacional', unit: '%', required: 85, critical: true, weight: 20 },
      { name: 'Área de gas disponible', desc: 'Área transversal disponible para flujo de gas', unit: 'pie²', required: 0.907, critical: false, weight: 10 },
      { name: 'Corte de agua a la salida', desc: 'Máximo 2% de agua en crudo tratado', unit: '%', required: 2, critical: true, weight: 15 },
      { name: 'Factor Z', desc: 'Factor de compresibilidad del gas entre 0.1 y 2.0', unit: '', required: 2, critical: false, weight: 10 },
    ];

    // Escenarios de evaluación (tratamiento_id, tipo, aprobado, score, commentario)
    const evalScenarios = [
      // Internos — cada tratador nuevo
      ...treatments.slice(2).map((t: any, i: number) => ({
        type: 'internal',
        treatmentId: t.id,
        extId: 'NULL',
        approved: i < 4, // los primeros 4 aprueban
        score: [95, 88, 72, 65, 45, 98][i] ?? 80,
        comment: [
          'Cumple holgadamente, crudo ligero sin problemas',
          'Cumple con margen ajustado en retención',
          'No cumple retención ni eficiencia de separación — crudo muy pesado',
          'Diseño insuficiente para emulsión tenaz de Hamaca',
          'Subdimensionado a propósito para demo de diagnóstico',
          'Sobredimensionado, holgura en todos los criterios',
        ][i] ?? '',
        user: (i % 2) + 1,
      })),
      // Externos
      ...extTreatments.slice(1).map((e: any, i: number) => ({
        type: 'external',
        treatmentId: 'NULL',
        extId: e.id,
        approved: i < 2,
        score: [82, 70, 90, 55][i] ?? 75,
        comment: [
          'Operación estable, cumple norma con margen',
          'Requiere aumento de temperatura para cumplir en invierno',
          'Excelente rendimiento con crudo liviano',
          'Sobrecargado, no cumple en condiciones pico',
        ][i] ?? '',
        user: ((i + 1) % 2) + 1,
      })),
    ];

    for (const sc of evalScenarios) {
      evalInserts.push(
        `(${evalId}, '${sc.type}', '${new Date(2026, 0 + evalId, 10 + evalId).toISOString()}',
          ${sc.approved}, ${sc.score === undefined ? 'NULL' : `'${sc.comment.replace(/'/g, "''")}'`},
          ${sc.score}, ${sc.treatmentId}, ${sc.extId}, ${sc.user}, NULL)`,
      );

      // Criterios para cada evaluación
      for (const c of api12LCriteria) {
        const margin = sc.approved ? 5 + Math.random() * 30 : -10 - Math.random() * 40;
        const actual = c.name.includes('Corte de agua')
          ? (sc.approved ? 0.5 + Math.random() * 1 : 2.5 + Math.random() * 3)
          : c.required * (1 + margin / 100);
        criteriaInserts.push(
          `(${evalId}, '${c.name}', '${c.desc.replace(/'/g, "''")}', '${c.unit}', ${c.required}, ${actual.toFixed(2)},
            ${margin > 0}, ${margin.toFixed(2)}, ${c.critical}, ${c.weight}, NULL)`,
        );
      }
      evalId++;
    }

    if (evalInserts.length) {
      await queryRunner.query(`
        INSERT INTO evaluations
          (id, "evaluationType", "evaluationDate", approved, comments, score,
           treatment_id, external_treatment_id, evaluated_by, "thermalCalculations")
        VALUES ${evalInserts.join(',\n')}
      `);

      await queryRunner.query(`
        INSERT INTO evaluation_criteria
          ("evaluationId", name, description, unit, "requiredValue", "actualValue",
           approved, "complianceMargin", "isCritical", weight, "maxValue")
        VALUES ${criteriaInserts.join(',\n')}
      `);

      // Reset sequence
      await queryRunner.query(
        `SELECT setval('evaluations_id_seq', (SELECT MAX(id) FROM evaluations))`,
      );
    }

    // ══════════════════════════════════════════════════════════
    // 5. DISPOSITIVOS y CANALES adicionales
    // ══════════════════════════════════════════════════════════
    const [dev2] = await queryRunner.query(`
      INSERT INTO devices (name, path, "baudRate", "autoConnect")
      VALUES ('Arduino Mega Lab', '/dev/ttyACM_SEED', 115200, false)
      RETURNING id
    `);

    const labChannels = [
      { name: 'PT100 Baño Principal', type: 'max31865', pins: '5,23,24,25,4', unit: '°F' },
      { name: 'DS18B20 Ambiente Lab', type: 'ds18b20', pins: '7,0', unit: '°F' },
      { name: 'Termopar Chimenea', type: 'max6675', pins: '8,13,12', unit: '°F' },
      { name: 'Relé Calentador 1', type: 'digital_out', pins: '22', unit: '' },
      { name: 'Relé Calentador 2', type: 'digital_out', pins: '23', unit: '' },
      { name: 'Sensor Nivel 1', type: 'analog_in', pins: 'A0', unit: 'cm' },
      { name: 'Sensor Nivel 2', type: 'analog_in', pins: 'A1', unit: 'cm' },
      { name: 'Válvula Servo', type: 'servo', pins: '9', unit: '°' },
    ];

    const labChIds: number[] = [];
    for (const ch of labChannels) {
      const [row] = await queryRunner.query(
        `INSERT INTO device_channels ("deviceId", name, type, pins, unit, "pollMs")
         VALUES ($1, $2, $3, $4, $5, 2000) RETURNING id`,
        [dev2.id, ch.name, ch.type, ch.pins, ch.unit],
      );
      labChIds.push(row.id);
    }

    // ── Reglas de seguridad ──
    await queryRunner.query(`
      INSERT INTO device_rules
        (name, "sourceChannelId", operator, threshold, hysteresis, "targetChannelId", "onValue", "offValue", enabled)
      VALUES
        ('Apagar calentador 1 si Baño > 200°F', ${labChIds[0]}, '>', 200, 3, ${labChIds[3]}, 0, 1, true),
        ('Apagar calentador 2 si Baño > 200°F', ${labChIds[0]}, '>', 200, 3, ${labChIds[4]}, 0, 1, true),
        ('Alarma chimenea > 350°F', ${labChIds[2]}, '>', 350, 5, ${labChIds[3]}, 0, NULL, true),
        ('Cerrar válvula si nivel alto', ${labChIds[5]}, '>', 25, 1, ${labChIds[7]}, 0, 90, true)
    `);

    // ── PID loops ──
    await queryRunner.query(`
      INSERT INTO pid_loops
        (name, "inputChannelId", "outputChannelId", setpoint, kp, ki, kd, "outMin", "outMax", "windowMs", enabled)
      VALUES
        ('PID Baño Principal → Calentador 1', ${labChIds[0]}, ${labChIds[3]}, 150, 3.0, 0.15, 0.8, 0, 255, 10000, false),
        ('PID Baño Principal → Calentador 2', ${labChIds[0]}, ${labChIds[4]}, 150, 2.5, 0.10, 0.5, 0, 255, 10000, false)
    `);

    // ══════════════════════════════════════════════════════════
    // 6. LECTURAS sintéticas para el segundo dispositivo
    //    Simula un ensayo de 2 horas: calentamiento rápido → sostenido → enfriamiento
    // ══════════════════════════════════════════════════════════
    const start2 = new Date('2026-10-15T08:00:00Z');
    const bathReadings: string[] = [];
    const ambReadings: string[] = [];
    const chimReadings: string[] = [];
    const heater1Readings: string[] = [];
    const level1Readings: string[] = [];

    let T = 75;
    const amb2 = 82;
    for (let min = 0; min <= 120; min++) {
      const at = new Date(start2.getTime() + min * 60_000).toISOString();
      const heaterOn = min < 80;

      // Euler: eta=0.9, UA=6, mass=80, cp=1.0, P=4000
      const P = heaterOn ? 0.9 * 4000 : 0;
      const loss = 6 * (T - amb2);
      T += ((P - loss) / 80) * (1 / 60);

      bathReadings.push(`(${labChIds[0]}, ${T.toFixed(2)}, '${at}')`);
      ambReadings.push(`(${labChIds[1]}, ${amb2 + Math.random() * 2 - 1}, '${at}')`);
      chimReadings.push(`(${labChIds[2]}, ${heaterOn ? 280 + Math.random() * 20 : 120 - min * 0.5}, '${at}')`);
      heater1Readings.push(`(${labChIds[3]}, ${heaterOn ? 1 : 0}, '${at}')`);
      level1Readings.push(`(${labChIds[5]}, ${10 + Math.sin(min / 15) * 2}, '${at}')`);
    }

    for (const batch of [bathReadings, ambReadings, chimReadings, heater1Readings, level1Readings]) {
      if (batch.length) {
        await queryRunner.query(
          `INSERT INTO channel_readings ("channelId", value, at) VALUES ${batch.join(',')}`,
        );
      }
    }

    // Command logs para el segundo dispositivo
    await queryRunner.query(`
      INSERT INTO device_command_logs ("deviceId", "channelId", "userId", source, command, response, at)
      VALUES
        (${dev2.id}, ${labChIds[3]}, 1, 'manual', 'WRITE 22 1', 'OK', '${start2.toISOString()}'),
        (${dev2.id}, ${labChIds[4]}, 1, 'manual', 'WRITE 23 1', 'OK', '${start2.toISOString()}'),
        (${dev2.id}, ${labChIds[3]}, NULL, 'rule', 'WRITE 22 0', 'OK', '${new Date(start2.getTime() + 80 * 60_000).toISOString()}'),
        (${dev2.id}, ${labChIds[4]}, NULL, 'rule', 'WRITE 23 0', 'OK', '${new Date(start2.getTime() + 80 * 60_000).toISOString()}'),
        (${dev2.id}, ${labChIds[7]}, 1, 'manual', 'SERVO 9 45', 'OK', '${new Date(start2.getTime() + 30 * 60_000).toISOString()}'),
        (${dev2.id}, ${labChIds[7]}, 1, 'manual', 'SERVO 9 90', 'OK', '${new Date(start2.getTime() + 60 * 60_000).toISOString()}')
    `);

    // ══════════════════════════════════════════════════════════
    // 7. ENSAYOS adicionales
    // ══════════════════════════════════════════════════════════
    const end2 = new Date(start2.getTime() + 120 * 60_000).toISOString();

    // Ensayo completado con el segundo dispositivo
    const [trial3] = await queryRunner.query(`
      INSERT INTO trials
        (name, "pilotDiameter", "pilotLength", "heaterPower",
         "bathTempChannelId", "ambientTempChannelId", "heaterChannelId",
         "levelChannelIds", "pidLoopId", "ruleIds",
         state, "startedAt", "endedAt", notes,
         "calibratedEta", "calibratedUA", "calibrationRmse")
      VALUES
        ('Ensayo Furrial 22°API - Lab', 0.75, 3, 4000,
         ${labChIds[0]}, ${labChIds[1]}, ${labChIds[3]},
         '${labChIds[5]},${labChIds[6]}', 2, '2,3',
         'completed', '${start2.toISOString()}', '${end2}',
         'Ensayo de laboratorio con crudo Furrial. 80 min calentamiento + 40 min enfriamiento.',
         0.88, 6.2, 0.35)
      RETURNING id
    `);

    // Ensayo abortado
    const [trial4] = await queryRunner.query(`
      INSERT INTO trials
        (name, "pilotDiameter", "pilotLength", "heaterPower",
         "bathTempChannelId", "ambientTempChannelId", "heaterChannelId",
         state, "startedAt", "endedAt", notes)
      VALUES
        ('Ensayo Bare 10°API - Abortado', 0.5, 2, 5000,
         ${labChIds[0]}, ${labChIds[1]}, ${labChIds[3]},
         'aborted', '2026-10-20T14:00:00Z', '2026-10-20T14:25:00Z',
         'Abortado: fuga detectada en junta de la tapa del piloto')
      RETURNING id
    `);

    // Ensayo en borrador con geometría distinta
    await queryRunner.query(`
      INSERT INTO trials
        (name, "pilotDiameter", "pilotLength", "heaterPower",
         "bathTempChannelId", "ambientTempChannelId", "heaterChannelId",
         state, notes)
      VALUES
        ('Ensayo Hamaca 8.5°API - Pendiente', 1.0, 4, 8000,
         ${labChIds[0]}, ${labChIds[1]}, ${labChIds[4]},
         'draft', 'Preparando ensayo para crudo ultrapesado. Requiere calentador de mayor potencia.'),
        ('Ensayo Repetición Morichal - Control', 0.5, 2, 5000,
         ${labChIds[0]}, ${labChIds[1]}, ${labChIds[3]},
         'draft', 'Repetición del ensayo Morichal para validar reproducibilidad de calibración')
    `);

    // ── Muestras para ensayo 3 ──
    const trial3Samples = [
      { label: 'BSW entrada', value: 25, unit: '%', min: 0 },
      { label: 'BSW salida (20 min)', value: 15.3, unit: '%', min: 20 },
      { label: 'BSW salida (40 min)', value: 6.8, unit: '%', min: 40 },
      { label: 'BSW salida (60 min)', value: 2.1, unit: '%', min: 60 },
      { label: 'BSW salida (80 min)', value: 1.5, unit: '%', min: 80 },
      { label: 'Viscosidad entrada', value: 45, unit: 'cSt', min: 0 },
      { label: 'Viscosidad salida (60 min)', value: 18.5, unit: 'cSt', min: 60 },
      { label: 'Temperatura de corte', value: 152, unit: '°F', min: 45 },
      { label: 'Gravedad API salida', value: 23.1, unit: '°API', min: 80 },
    ];

    const sampleVals = trial3Samples.map((s) => {
      const at = new Date(start2.getTime() + s.min * 60_000).toISOString();
      return `(${trial3.id}, '${s.label}', ${s.value}, '${s.unit}', '${at}')`;
    }).join(',');

    await queryRunner.query(`
      INSERT INTO trial_samples ("trialId", label, value, unit, at)
      VALUES ${sampleVals}
    `);

    // Muestras para ensayo abortado (pocas, porque se canceló rápido)
    await queryRunner.query(`
      INSERT INTO trial_samples ("trialId", label, value, unit, at)
      VALUES
        (${trial4.id}, 'BSW entrada', 40, '%', '2026-10-20T14:00:00Z'),
        (${trial4.id}, 'Nota: fuga detectada', 0, '', '2026-10-20T14:25:00Z')
    `);

    // ══════════════════════════════════════════════════════════
    // 8. TEMPLATES adicionales con criterios
    // ══════════════════════════════════════════════════════════
    await queryRunner.query(`
      INSERT INTO evaluation_templates (name, description, version, "applicableTo", "isActive")
      VALUES
        ('Evaluación crudo pesado (< 15°API)',
         'Criterios ajustados para crudos pesados y extrapesados con emulsiones tenaces',
         '2.0', 'horizontal', true),
        ('Evaluación rápida campo',
         'Evaluación simplificada para verificación rápida en campo',
         '1.0', 'horizontal,vertical', true)
    `);

    // Criterios para template de crudo pesado
    const heavyTemplateId = (await queryRunner.query(
      `SELECT id FROM evaluation_templates WHERE name LIKE '%pesado%' ORDER BY id DESC LIMIT 1`,
    ))[0].id;

    await queryRunner.query(`
      INSERT INTO evaluation_template_criteria
        (name, description, "minValue", "maxValue", unit, "isCritical", weight, "templateId")
      VALUES
        ('Tiempo de retención de petróleo',
         'Mínimo 90 min para crudos <15°API según experiencia operacional',
         90, NULL, 'min', true, 25, ${heavyTemplateId}),
        ('Porcentaje de deshidratación',
         'Mínimo 90% para asegurar especificación de exportación',
         90, NULL, '%', true, 20, ${heavyTemplateId}),
        ('Eficiencia de separación',
         'Mínimo 80% - más laxo por la dificultad del crudo',
         80, NULL, '%', true, 20, ${heavyTemplateId}),
        ('Temperatura de tratamiento',
         'Debe alcanzar al menos 170°F para romper emulsión',
         170, 220, '°F', true, 15, ${heavyTemplateId}),
        ('Corte de agua a la salida',
         'Máximo 3% para crudo pesado (más permisivo)',
         0, 3, '%', true, 20, ${heavyTemplateId})
    `);

    // Criterios para template rápido
    const quickTemplateId = (await queryRunner.query(
      `SELECT id FROM evaluation_templates WHERE name LIKE '%rápida%' ORDER BY id DESC LIMIT 1`,
    ))[0].id;

    await queryRunner.query(`
      INSERT INTO evaluation_template_criteria
        (name, description, "minValue", "maxValue", unit, "isCritical", weight, "templateId")
      VALUES
        ('Tiempo de retención',
         'Mínimo 60 min estándar API-12L',
         60, NULL, 'min', true, 35, ${quickTemplateId}),
        ('Corte de agua',
         'Máximo 2% estándar',
         0, 2, '%', true, 35, ${quickTemplateId}),
        ('Temperatura alcanzada',
         'Debe superar temperatura de tratamiento objetivo',
         0, NULL, '°F', false, 30, ${quickTemplateId})
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Limpiar en orden inverso de dependencias
    await queryRunner.query(`DELETE FROM trial_samples WHERE "trialId" > 2`);
    await queryRunner.query(`DELETE FROM trials WHERE id > 2`);
    await queryRunner.query(`DELETE FROM channel_readings WHERE "channelId" IN (SELECT id FROM device_channels WHERE "deviceId" IN (SELECT id FROM devices WHERE path = '/dev/ttyACM_SEED'))`);
    await queryRunner.query(`DELETE FROM device_command_logs WHERE "deviceId" IN (SELECT id FROM devices WHERE path = '/dev/ttyACM_SEED')`);
    await queryRunner.query(`DELETE FROM pid_loops WHERE name LIKE 'PID Baño Principal%'`);
    await queryRunner.query(`DELETE FROM device_rules WHERE name LIKE 'Apagar calentador 1%' OR name LIKE 'Apagar calentador 2%' OR name LIKE 'Alarma chimenea%' OR name LIKE 'Cerrar válvula%'`);
    await queryRunner.query(`DELETE FROM device_channels WHERE "deviceId" IN (SELECT id FROM devices WHERE path = '/dev/ttyACM_SEED')`);
    await queryRunner.query(`DELETE FROM devices WHERE path = '/dev/ttyACM_SEED'`);
    await queryRunner.query(`DELETE FROM evaluation_template_criteria WHERE "templateId" IN (SELECT id FROM evaluation_templates WHERE name LIKE '%pesado%' OR name LIKE '%rápida%')`);
    await queryRunner.query(`DELETE FROM evaluation_templates WHERE name LIKE '%pesado%' OR name LIKE '%rápida%'`);
    await queryRunner.query(`DELETE FROM evaluation_criteria WHERE "evaluationId" > 3`);
    await queryRunner.query(`DELETE FROM evaluations WHERE id > 3`);
    await queryRunner.query(`DELETE FROM external_treatments WHERE name LIKE '%Campo%' OR name LIKE '%Gun Barrel%'`);
    await queryRunner.query(`DELETE FROM treatments WHERE id > 2`);
    await queryRunner.query(`DELETE FROM users WHERE email LIKE '%@termolab.com' AND id > 2`);
  }
}

# Graph Report - termo-lab-api  (2026-11-26)

## Corpus Check
- 254 files · ~118,545 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .example 2, .ino 1)

## Summary
- 2141 nodes · 5027 edges · 131 communities (70 shown, 61 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 160 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2b752af9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AppSettingsDto
- evaluations.module.ts
- UserResponseDto
- ThermalCalculatorService
- devices.dto.ts
- DevicesController
- package.json
- TrialsController
- dependencies
- PipelineFeedDto
- DevicesService
- treatments.service.ts
- scripts
- SimulationController
- deploy
- additionalProperties
- .generateEvaluationReport
- trials.controller.ts
- app.module.ts
- Scripts Disponibles
- users.service.ts
- CurrentUser
- IdEntity
- compilerOptions
- README.md
- BaseResponseDto
- separator.ts
- thermal-analysis.service.ts
- control.ts
- Evaluation
- main.ts
- ThermalTreatmentInputDto
- TrialsService
- CreateEvaluationDto
- ThermalCalculationsController
- TreatmentResponseDto
- .faceLogin
- 4. Fórmulas de Flujos y Caudales
- trials.service.ts
- SerialConnection
- DaysOfWeek
- CreateTemplateCriteriaDto
- TestController
- evaluations.service.ts
- 5. Fórmulas de Áreas y Volúmenes
- jest
- ChannelType
- bcrypt
- AddTrials1794021872972
- SeedTrialAndDeviceData1794021872973
- Fórmulas Implementadas en el Sistema Termo-Lab
- 7. Fórmulas de Decantación
- auth.service.ts
- 10. Fórmulas de Evaluación
- 9. Fórmulas de Boquillas
- nest-cli.json
- SeedTreatmentOptions1751181394026
- .createEvaluation
- Despliegue en Railway
- 1. Fórmulas de Propiedades del Crudo
- 3. Fórmulas de Propiedades del Gas
- openapitools.json
- 11. Fórmulas Adicionales
- 2. Fórmulas de Propiedades del Agua
- 6. Fórmulas de Tiempos de Retención
- 8. Fórmulas de Calor
- Plan de acción — Análisis avanzado y gemelo digital
- index.d.ts
- components.ts
- CreateUnaccentExtension1752379896329
- AddThermalCalculationFields1759797734044
- AddThermalCalculationsToEvaluations1763061460756
- AddTemplateIdToEvaluations1763061460757
- @nestjs/swagger
- @nestjs/common
- TestService
- thermal-calculator.service.ts
- start-backend-debug.sh
- Scripts de Generación de Cliente API - Termo Lab
- pdf.service.ts
- Evaluation
- Documentación — Termo-Lab API
- simulation-runner.ts
- AddDevices1794006813002
- CrudRepository
- CreateTestDto
- .changePassword
- ChromatographyInputDto
- equipment.controller.ts
- typeorm
- reports.controller.ts
- AuthService
- auth/dto/index.ts
- QueryBaseDto
- FaceLoginDto
- CreateSampleTreatments1751337651500
- AuditLog
- CreateEvaluationCriteriaDto
- eos.ts
- EquipmentController
- thermal-twin.service.ts
- TreatmentsService
- QueryAuditDto
- UserResponseDto
- SetPasswordDto
- CreateExternalTreatmentDto
- simulation.service.ts
- TestResponseDto
- ThermalTreatmentInput
- RegisterDto
- User
- AppSettingsDto
- SecurityHardening1794200000000
- PasswordSetupToken1794200000002
- UserPermissionsAndSettings1794200000003
- CreateUserDto
- UpdateProfileDto
- test.service.ts
- auth.controller.ts
- .simulate
- CreateTreatmentDto
- @nestjs/testing
- AppSettings
- MailService
- QueryEvaluationDto
- trials.controller.ts
- permission.guard.ts
- QueryTreatmentDto
- jwt-auth.guard.ts
- AuditLogs1794200000005

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 84 edges
2. `User` - 71 edges
3. `@nestjs/common` - 67 edges
4. `ThermalCalculatorService` - 62 edges
5. `DevicesService` - 54 edges
6. `typeorm` - 51 edges
7. `CurrentUser` - 41 edges
8. `TreatmentsService` - 35 edges
9. `Evaluation` - 34 edges
10. `class-validator` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Notas` --references--> `applyDatabaseEnv()`  [INFERRED]
  docs/RAILWAY.md → src/common/config/apply-database-url.ts
- `Dónde se aplica en el código` --references--> `api12lWindK()`  [INFERRED]
  docs/normas/README.md → src/repositories/evaluations/services/api12l.tables.ts
- `Dónde se aplica en el código` --references--> `api12lFirebox()`  [INFERRED]
  docs/normas/README.md → src/repositories/evaluations/services/api12l.tables.ts
- `DesignVar` --references--> `ThermalTreatmentInput`  [EXTRACTED]
  src/repositories/evaluations/services/thermal-analysis.service.ts → src/repositories/evaluations/services/thermal-calculator.service.ts
- `validateEnv()` --calls--> `applyDatabaseEnv()`  [EXTRACTED]
  src/app.module.ts → src/common/config/apply-database-url.ts

## Import Cycles
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation-template.entity.ts -> src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts`
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation.entity.ts -> src/repositories/evaluations/entities/evaluation-criteria.entity.ts`

## Communities (131 total, 61 thin omitted)

### Community 0 - "AppSettingsDto"
Cohesion: 0.15
Nodes (5): SettingsController, AppSettingsResponseDto, DEFAULT_SETTINGS, UpdateAppSettingsDto, SettingsService

### Community 1 - "evaluations.module.ts"
Cohesion: 0.06
Nodes (11): CreateTreatmentOptionDto, TreatmentOptionListDto, TreatmentOptionResponseDto, UpdateTreatmentOptionDto, TreatmentOption, TreatmentOptionController, TreatmentOptionsModule, ALLOWED_SORT (+3 more)

### Community 4 - "devices.dto.ts"
Cohesion: 0.17
Nodes (11): CreateChannelDto, CreateDeviceDto, CreatePidDto, CreateRuleDto, RawCommandDto, ReadingsQueryDto, UpdateChannelDto, UpdateDeviceDto (+3 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (53): author, description, devDependencies, eslint@^8.0.0, eslint-config-prettier@^9.0.0, eslint-plugin-prettier@^5.0.0, jest@^29.5.0, @nestjs/cli@^10.0.0 (+45 more)

### Community 7 - "TrialsController"
Cohesion: 0.15
Nodes (3): TrialsController, FlightRecorderRow, TrialReportDto

### Community 8 - "dependencies"
Cohesion: 0.05
Nodes (42): dependencies, bcrypt@^6.0.0, class-transformer@^0.5.1, class-validator@^0.14.2, express-session@^1.18.1, jsonwebtoken@^9.0.2, @nestjs/common@^11.1.3, @nestjs/config@^4.0.2 (+34 more)

### Community 9 - "PipelineFeedDto"
Cohesion: 0.18
Nodes (3): PipelineFeedDto, PipelineStepDto, RunPipelineDto

### Community 11 - "treatments.service.ts"
Cohesion: 0.17
Nodes (4): PaginationDataDto, TreatmentCalculationsDto, UpdateTreatmentDto, CalculateTreatmentValidationPipe

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 14 - "deploy"
Cohesion: 0.20
Nodes (9): build, builder, dockerfilePath, deploy, healthcheckPath, healthcheckTimeout, restartPolicyMaxRetries, restartPolicyType (+1 more)

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - ".generateEvaluationReport"
Cohesion: 0.23
Nodes (3): FORMAT_QUERY, ReportsController, wantsPdf()

### Community 17 - "trials.controller.ts"
Cohesion: 0.13
Nodes (17): AddSampleDto, CalibrateTwinDto, CalibrationResultDto, CalibrationStatusDto, CreateTrialDto, series(), SeriesValidators(), SimulateTwinDto (+9 more)

### Community 18 - "app.module.ts"
Cohesion: 0.09
Nodes (10): @nestjs/core@^11.1.3, @nestjs/serve-static@^5.0.3, @nestjs/core, @nestjs/serve-static, AppController, AppModule, AppService, clip() (+2 more)

### Community 19 - "Scripts Disponibles"
Cohesion: 0.20
Nodes (10): Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Generación de Clientes, Generación de Swagger, Limpieza (Linux/macOS) (+2 more)

### Community 20 - "users.service.ts"
Cohesion: 0.17
Nodes (6): AdminGuard, UpdateUserDto, UserRole, ADMIN, OPERATOR, ALLOWED_SORT

### Community 22 - "IdEntity"
Cohesion: 0.12
Nodes (3): CreateEvaluationTemplates1751337696278, EvaluationTemplateCriteria, EvaluationTemplate

### Community 23 - "compilerOptions"
Cohesion: 0.09
Nodes (21): exclude, extends, compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators (+13 more)

### Community 24 - "README.md"
Cohesion: 0.17
Nodes (10): Compile and run the project, Deployment, Description, Documentación, License, Project setup, Resources, Run tests (+2 more)

### Community 26 - "separator.ts"
Cohesion: 0.10
Nodes (33): API12L_HORIZONTAL_SIZES, api12lWindK(), CriterionResult, calculateSeparator(), clamp01(), estimateGasDensity(), estimateGOR(), SeparatorCriterion (+25 more)

### Community 27 - "thermal-analysis.service.ts"
Cohesion: 0.11
Nodes (22): allPass(), bisect(), checkCriteria(), clampPercent(), DESIGN_VARS, DesignVar, DiagnoseResult, Distribution (+14 more)

### Community 28 - "control.ts"
Cohesion: 0.14
Nodes (24): serialport, calibrate(), ChannelLike, COMMAND_REGEX, evalRule(), OUTPUT_TYPES, outputRange(), parseValue() (+16 more)

### Community 30 - "main.ts"
Cohesion: 0.10
Nodes (15): cookie-parser@^1.4.7, csurf@^1.2.2, helmet@^8.1.0, cookie-parser, csurf, helmet, validateEnv(), JwtAuthGuard (+7 more)

### Community 31 - "ThermalTreatmentInputDto"
Cohesion: 0.20
Nodes (6): DistributionDto, DistributionsDto, GasCompositionDto, MonteCarloInputDto, ReportRequestDto, ThermalTreatmentInputDto

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "trials.service.ts"
Cohesion: 0.20
Nodes (8): ChannelReading, Device, DEVICE_ENTITIES, DeviceChannel, DeviceCommandLog, DeviceRule, double, PidLoop

### Community 40 - "DaysOfWeek"
Cohesion: 0.20
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 43 - "evaluations.service.ts"
Cohesion: 0.14
Nodes (5): EvaluationCriteriaResponseDto, EvaluationResponseDto, EvaluationTemplateResponseDto, ExternalTreatmentResponseDto, UpdateEvaluationDto

### Community 44 - "5. Fórmulas de Áreas y Volúmenes"
Cohesion: 0.22
Nodes (9): 5.1 Área Total del Recipiente (Ecuación 1.10), 5.2 Área desde el Fondo al Nivel Bajo Bajo de Agua (Ecuación 1.9), 5.3 Área Ocupada por el Agua (Ecuación 1.17 / Ec. 26), 5.4 Área Ocupada por el Crudo (Ecuación 1.4 / Ec. 13), 5.5 Área Disponible para el Gas (Ecuación 1.11), 5.6 Área Requerida para el Gas (Ecuación 1.15 / Ec. 25), 5.7 Volumen de Retención del Crudo (Ecuación 1.5), 5.8 Volumen de Retención del Agua (Ecuación 1.12) (+1 more)

### Community 45 - "jest"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 46 - "ChannelType"
Cohesion: 0.22
Nodes (9): ChannelType, ANALOG_IN, DIGITAL_IN, DIGITAL_OUT, DS18B20, MAX31865, MAX6675, PWM (+1 more)

### Community 47 - "bcrypt"
Cohesion: 0.16
Nodes (6): bcrypt, seedPassword(), SeedAdminAndOperatorUsers1751178224375, UpdateUserPasswords1759794383734, SeedAllModules1794108000000, RotateDefaultPasswords1794200000001

### Community 50 - "Fórmulas Implementadas en el Sistema Termo-Lab"
Cohesion: 0.33
Nodes (6): Backend (termo-lab-api), Fórmulas Implementadas en el Sistema Termo-Lab, 📝 Notas Importantes, 🔍 Referencias, 📊 Resumen de Archivos, 📋 Índice

### Community 51 - "7. Fórmulas de Decantación"
Cohesion: 0.29
Nodes (7): 7.1 Velocidad de Decantación de la Fase Pesada (Ecuación 1.22), 7.2 Tiempo de Decantación de la Fase Pesada (Ecuación 1.23), 7.3 Tiempo de Decantación de la Fase Liviana (Ecuación 1.24 / Ec. 33), 7.4 Porcentaje de Deshidratación del Equipo (Ecuación 1.19 / Ec. 28), 7.5 Cantidad de Agua Saliendo con el Crudo (Ecuación 1.18 / Ec. 27), 7.6 Corte de Agua del Crudo Saliendo (Ecuación 1.13 / Ec. 23), 7. Fórmulas de Decantación

### Community 52 - "auth.service.ts"
Cohesion: 0.14
Nodes (6): @nestjs/config, @nestjs/jwt, DUMMY_HASH, LoginDto, JwtPayload, JwtStrategy

### Community 53 - "10. Fórmulas de Evaluación"
Cohesion: 0.33
Nodes (6): 10.1 Margen de Cumplimiento, 10.2 Promedio de Cumplimiento, 10.3 Puntaje Ponderado, 10.4 Eficiencia de Separación, 10.5 Eficiencia de Separación (Alternativa), 10. Fórmulas de Evaluación

### Community 54 - "9. Fórmulas de Boquillas"
Cohesion: 0.33
Nodes (6): 9.1 Velocidad en Boquilla de Entrada, 9.2 Diámetro de Boquilla, 9.3 Velocidad en Boquilla de Salida de Crudo, 9.4 Velocidad en Boquilla de Salida de Agua, 9.5 Velocidad en Boquilla de Salida de Gas, 9. Fórmulas de Boquillas

### Community 55 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 58 - "Despliegue en Railway"
Cohesion: 0.17
Nodes (12): 1. Proyecto y Postgres, 2. Servicio API, 3. Servicio Web, 4. Verificación, 5. SMTP (después del primer deploy), Auditoría (`/api/audit-logs`, solo admin), Auditoría y respaldos, Despliegue en Railway (+4 more)

### Community 59 - "1. Fórmulas de Propiedades del Crudo"
Cohesion: 0.40
Nodes (5): 1.1 Gravedad Específica del Crudo (Ecuación 1.32), 1.2 Densidad del Crudo (Ecuación 1.35), 1.3 Calor Específico del Crudo (Ecuación 1.33), 1.4 Flujo Másico del Crudo (Ecuación 1.20), 1. Fórmulas de Propiedades del Crudo

### Community 60 - "3. Fórmulas de Propiedades del Gas"
Cohesion: 0.40
Nodes (5): 3.1 Densidad del Gas Real (Ecuación 1.31), 3.2 Factor de Compresibilidad Z (Ecuación 1.1), 3.3 Peso Molecular del Gas, 3.4 Velocidad Permisible para el Gas (Ecuación 1.14 / Ec. 24), 3. Fórmulas de Propiedades del Gas

### Community 61 - "openapitools.json"
Cohesion: 0.40
Nodes (4): generator-cli, version, $schema, spaces

### Community 62 - "11. Fórmulas Adicionales"
Cohesion: 0.50
Nodes (4): 11.1 Conversión de BPD a pie³/s, 11.2 Volumen Interno del Tratador, 11.3 Tiempo de Residencia Estimado, 11. Fórmulas Adicionales

### Community 63 - "2. Fórmulas de Propiedades del Agua"
Cohesion: 0.50
Nodes (4): 2.1 Densidad del Agua (Ecuación 1.36), 2.2 Calor Específico del Agua (Ecuación 1.34), 2.3 Flujo Másico de Agua (Ecuación 1.21), 2. Fórmulas de Propiedades del Agua

### Community 64 - "6. Fórmulas de Tiempos de Retención"
Cohesion: 0.50
Nodes (4): 6.1 Tiempo de Retención Estimado (Ecuación 1.8), 6.2 Tiempo de Retención del Petróleo, 6.3 Tiempo de Retención del Agua, 6. Fórmulas de Tiempos de Retención

### Community 65 - "8. Fórmulas de Calor"
Cohesion: 0.50
Nodes (4): 8.1 Calor Absorbido por el Proceso (Ecuación 1.25 / Ec. 8), 8.2 Pérdidas de Calor (Ecuación 1.25 / Ec. 8), 8.3 Calor Total Requerido (Ecuación 1.25 / Ec. 34), 8. Fórmulas de Calor

### Community 66 - "Plan de acción — Análisis avanzado y gemelo digital"
Cohesion: 0.29
Nodes (7): Cronograma, Fase 1 — Detective de fallas y tornado, Fase 2 — Monte Carlo de cumplimiento, Fase 3 — Ensayo en piloto y flight recorder, Fase 4 — Gemelo térmico y calibración, Plan de acción — Análisis avanzado y gemelo digital, Riesgos y decisiones abiertas

### Community 68 - "components.ts"
Cohesion: 0.04
Nodes (44): BIP, C1, C2, C3, C36P, CO2, COMP_INDEX, H2O (+36 more)

### Community 73 - "@nestjs/swagger"
Cohesion: 0.13
Nodes (7): class-transformer, class-validator, @nestjs/swagger, IdCreateEntity, EvaluationType, EXTERNAL, INTERNAL

### Community 74 - "@nestjs/common"
Cohesion: 0.14
Nodes (9): @nestjs/common, @nestjs/typeorm, DevicesModule, EvaluationsModule, SettingsModule, RunnerService, SimulationModule, TRIAL_ENTITIES (+1 more)

### Community 76 - "thermal-calculator.service.ts"
Cohesion: 0.12
Nodes (17): API Spec 12L — Vertical and Horizontal Emulsion Treaters, Dónde se aplica en el código, Inconsistencias de la norma y cómo se resolvieron, Normas de referencia, Pendiente, porque falta información de entrada, CompleteApi12lTreatmentOptions1794200000004, API12L_INSULATED_LOSS_FACTOR, API12L_MAX_HEAT_FLUX (+9 more)

### Community 79 - "Scripts de Generación de Cliente API - Termo Lab"
Cohesion: 0.33
Nodes (5): Configuración, Estructura de Archivos Generados, Flujo de Trabajo Recomendado, Notas Importantes, Scripts de Generación de Cliente API - Termo Lab

### Community 80 - "pdf.service.ts"
Cohesion: 0.24
Nodes (6): pdfkit@^0.21.0, pdfkit, ascii(), canonicalJson(), PdfReport, PdfSection

### Community 81 - "Evaluation"
Cohesion: 0.09
Nodes (4): CreateSampleEvaluations1751337651990, EvaluationCriteria, Evaluation, ExternalTreatment

### Community 82 - "Documentación — Termo-Lab API"
Cohesion: 0.40
Nodes (5): Código relacionado con el plan, Documentación — Termo-Lab API, Grafo del código, Hoja de ruta y producto, Referencia técnica en el repositorio

### Community 83 - "simulation-runner.ts"
Cohesion: 0.10
Nodes (27): calcEffectiveness(), calculateHeatExchanger(), estimateShellDiameter(), FlowArrangement, HeatExchangerInput, HeatExchangerResult, calculateStorageTank(), estimateRVP() (+19 more)

### Community 85 - "CrudRepository"
Cohesion: 0.18
Nodes (4): rxjs@^7.8.1, rxjs, CrudRepository, UseCase

### Community 88 - "ChromatographyInputDto"
Cohesion: 0.29
Nodes (4): ChromatographyInputDto, FlashInputDto, FluidPropertiesInputDto, MoleFractionDto

### Community 89 - "equipment.controller.ts"
Cohesion: 0.34
Nodes (5): HeatExchangerFluidDto, HeatExchangerInputDto, SeparatorInputDto, StorageTankInputDto, ThermalTreaterInputDto

### Community 90 - "typeorm"
Cohesion: 0.19
Nodes (4): typeorm, IdEntity, double, TrialState

### Community 91 - "reports.controller.ts"
Cohesion: 0.16
Nodes (4): PdfService, CalculationCriteria, ComparisonOperator, EvaluationCalculationResult

### Community 93 - "auth/dto/index.ts"
Cohesion: 0.35
Nodes (4): AuthResponseDto, LoginResponseDto, UserDataDto, RegisterResponseDto

### Community 94 - "QueryBaseDto"
Cohesion: 0.16
Nodes (4): PaginationDto, QueryBaseDto, pagination(), normalizeText()

### Community 97 - "AuditLog"
Cohesion: 0.10
Nodes (10): AuditPageDto, actionFor(), AuditInterceptor, AUTH_ACTIONS, IGNORED, MUTATING, AuditLog, AuditModule (+2 more)

### Community 99 - "eos.ts"
Cohesion: 0.15
Nodes (16): SimulationService, getKij(), PureComponent, calcPhase(), EOS_CONST, EosParams, EosType, lnPhiMix() (+8 more)

### Community 101 - "thermal-twin.service.ts"
Cohesion: 0.36
Nodes (9): calibrate(), CalibrationResult, pilotMass(), sampler(), simulateTwin(), TimeSeries, TwinParams, TwinPoint (+1 more)

### Community 107 - "simulation.service.ts"
Cohesion: 0.16
Nodes (20): clamp01(), createInletStream(), ResolvedWater, resolveWaterFractions(), ChromatographyResult, distributeGasPhase(), estimateGOR(), generateChromatography() (+12 more)

### Community 109 - "ThermalTreatmentInput"
Cohesion: 0.30
Nodes (4): EvaluationReportData, ReportGeneratorService, ThermalCalculationResults, ThermalTreatmentInput

### Community 122 - "@nestjs/testing"
Cohesion: 0.25
Nodes (4): @nestjs/testing@^11.2.8, supertest@^7.0.0, @nestjs/testing, supertest

### Community 127 - "permission.guard.ts"
Cohesion: 0.33
Nodes (3): MESSAGES, Permission, PermissionGuard()

## Knowledge Gaps
- **19 isolated node(s):** `ADMIN`, `OPERATOR`, `FRIDAY`, `MONDAY`, `SATURDAY` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 790 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `AppSettingsDto`, `jwt-auth.guard.ts`, `evaluations.module.ts`, `devices.dto.ts`, `package.json`, `dependencies`, `treatments.service.ts`, `app.module.ts`, `users.service.ts`, `thermal-analysis.service.ts`, `control.ts`, `main.ts`, `evaluations.service.ts`, `auth.service.ts`, `thermal-calculator.service.ts`, `pdf.service.ts`, `ChromatographyInputDto`, `equipment.controller.ts`, `reports.controller.ts`, `AuditLog`, `thermal-twin.service.ts`, `simulation.service.ts`, `ThermalTreatmentInput`, `test.service.ts`, `auth.controller.ts`, `@nestjs/testing`, `MailService`, `trials.controller.ts`, `permission.guard.ts`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **What connects `ADMIN`, `OPERATOR`, `FRIDAY` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppSettingsDto` be split into smaller, more focused modules?**
  _Cohesion score 0.14814814814814814 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `AppSettingsDto`, `evaluations.module.ts`, `devices.dto.ts`, `package.json`, `dependencies`, `treatments.service.ts`, `trials.controller.ts`, `app.module.ts`, `users.service.ts`, `BaseResponseDto`, `thermal-analysis.service.ts`, `main.ts`, `ThermalTreatmentInputDto`, `trials.service.ts`, `evaluations.service.ts`, `auth.service.ts`, `thermal-calculator.service.ts`, `ChromatographyInputDto`, `equipment.controller.ts`, `typeorm`, `reports.controller.ts`, `auth/dto/index.ts`, `FaceLoginDto`, `AuditLog`, `SetPasswordDto`, `RegisterDto`, `test.service.ts`, `auth.controller.ts`, `trials.controller.ts`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Should `evaluations.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Why does `typeorm` connect `typeorm` to `AppSettingsDto`, `evaluations.module.ts`, `AuditLogs1794200000005`, `package.json`, `dependencies`, `treatments.service.ts`, `app.module.ts`, `users.service.ts`, `IdEntity`, `control.ts`, `main.ts`, `trials.service.ts`, `evaluations.service.ts`, `bcrypt`, `AddTrials1794021872972`, `SeedTrialAndDeviceData1794021872973`, `auth.service.ts`, `SeedTreatmentOptions1751181394026`, `CreateUnaccentExtension1752379896329`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `@nestjs/common`, `thermal-calculator.service.ts`, `AddDevices1794006813002`, `reports.controller.ts`, `AuditLog`, `SecurityHardening1794200000000`, `PasswordSetupToken1794200000002`, `UserPermissionsAndSettings1794200000003`, `test.service.ts`, `trials.controller.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `UserResponseDto` be split into smaller, more focused modules?**
  _Cohesion score 0.14245014245014245 - nodes in this community are weakly interconnected._
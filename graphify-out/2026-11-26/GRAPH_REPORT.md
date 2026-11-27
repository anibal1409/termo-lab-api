# Graph Report - termo-lab-api  (2026-11-26)

## Corpus Check
- 246 files · ~115,395 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 2, .ino 1)

## Summary
- 2071 nodes · 4899 edges · 111 communities (69 shown, 42 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 157 edges (avg confidence: 0.85)
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
- @nestjs/common
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
- TreatmentsService
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
- IdCreateEntity
- devices.module.ts
- Test
- thermal-calculator.service.ts
- start-backend-debug.sh
- Scripts de Generación de Cliente API - Termo Lab
- trials.controller.ts
- EvaluationCriteria
- Documentación — Termo-Lab API
- simulation-runner.ts
- AddDevices1794006813002
- rxjs
- BaseEntityDto
- .changePassword
- ChromatographyInputDto
- equipment.controller.ts
- typeorm
- evaluations.module.ts
- AuthService
- auth/dto/index.ts
- QueryBaseDto
- FaceLoginDto
- CreateSampleTreatments1751337651500
- CreateEvaluationTemplates1751337696278
- CreateEvaluationCriteriaDto
- eos.ts
- EquipmentController
- thermal-twin.service.ts
- SetPasswordDto
- simulation.service.ts
- heat-exchanger.ts
- RegisterDto
- User
- SecurityHardening1794200000000
- PasswordSetupToken1794200000002
- UserPermissionsAndSettings1794200000003
- LoginDto

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 81 edges
2. `User` - 71 edges
3. `@nestjs/common` - 63 edges
4. `ThermalCalculatorService` - 62 edges
5. `DevicesService` - 54 edges
6. `typeorm` - 48 edges
7. `CurrentUser` - 41 edges
8. `TreatmentsService` - 35 edges
9. `Evaluation` - 34 edges
10. `class-validator` - 32 edges

## Surprising Connections (you probably didn't know these)
- `Notas` --references--> `applyDatabaseEnv()`  [INFERRED]
  docs/RAILWAY.md → src/common/config/apply-database-url.ts
- `Dónde se aplica en el código` --references--> `api12lWindK()`  [INFERRED]
  docs/normas/README.md → src/repositories/evaluations/services/api12l.tables.ts
- `Dónde se aplica en el código` --references--> `api12lFirebox()`  [INFERRED]
  docs/normas/README.md → src/repositories/evaluations/services/api12l.tables.ts
- `validateEnv()` --calls--> `applyDatabaseEnv()`  [EXTRACTED]
  src/app.module.ts → src/common/config/apply-database-url.ts
- `QueryEvaluationDto` --inherits--> `QueryBaseDto`  [EXTRACTED]
  src/repositories/evaluations/dto/query-evaluation.dto.ts → src/common/pagination/dto/query-base.dto.ts

## Import Cycles
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation.entity.ts -> src/repositories/evaluations/entities/evaluation-criteria.entity.ts`
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation-template.entity.ts -> src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts`

## Communities (111 total, 42 thin omitted)

### Community 0 - "AppSettingsDto"
Cohesion: 0.07
Nodes (10): MESSAGES, Permission, PermissionGuard(), SettingsController, AppSettingsDto, AppSettingsResponseDto, DEFAULT_SETTINGS, UpdateAppSettingsDto (+2 more)

### Community 1 - "evaluations.module.ts"
Cohesion: 0.07
Nodes (5): CreateTreatmentOptionDto, TreatmentOptionResponseDto, TreatmentOption, TreatmentOptionController, TreatmentOptionService

### Community 4 - "devices.dto.ts"
Cohesion: 0.17
Nodes (11): CreateChannelDto, CreateDeviceDto, CreatePidDto, CreateRuleDto, RawCommandDto, ReadingsQueryDto, UpdateChannelDto, UpdateDeviceDto (+3 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (53): author, description, devDependencies, eslint@^8.0.0, eslint-config-prettier@^9.0.0, eslint-plugin-prettier@^5.0.0, jest@^29.5.0, @nestjs/cli@^10.0.0 (+45 more)

### Community 8 - "dependencies"
Cohesion: 0.05
Nodes (44): dependencies, bcrypt@^6.0.0, class-transformer@^0.5.1, class-validator@^0.14.2, express-session@^1.18.1, jsonwebtoken@^9.0.2, @nestjs/common@^11.1.3, @nestjs/config@^4.0.2 (+36 more)

### Community 9 - "PipelineFeedDto"
Cohesion: 0.18
Nodes (3): PipelineFeedDto, PipelineStepDto, RunPipelineDto

### Community 11 - "treatments.service.ts"
Cohesion: 0.11
Nodes (9): PaginationDataDto, PaginationDto, pagination(), normalizeText(), QueryTreatmentDto, TreatmentCalculationsDto, TreatmentResponseDto, UpdateTreatmentDto (+1 more)

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 14 - "deploy"
Cohesion: 0.18
Nodes (10): build, buildCommand, builder, deploy, healthcheckPath, healthcheckTimeout, restartPolicyMaxRetries, restartPolicyType (+2 more)

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - ".generateEvaluationReport"
Cohesion: 0.13
Nodes (6): FORMAT_QUERY, ReportsController, wantsPdf(), EvaluationReportData, ReportGeneratorService, ThermalCalculationResults

### Community 17 - "trials.controller.ts"
Cohesion: 0.13
Nodes (20): AddSampleDto, CalibrateTwinDto, CalibrationResultDto, CalibrationStatusDto, CreateTrialDto, FlightRecorderRow, series(), SeriesValidators() (+12 more)

### Community 18 - "app.module.ts"
Cohesion: 0.09
Nodes (11): @nestjs/serve-static@^5.0.3, supertest@^7.0.0, @nestjs/serve-static, supertest, AppController, AppModule, AppService, clip() (+3 more)

### Community 19 - "Scripts Disponibles"
Cohesion: 0.20
Nodes (10): Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Generación de Clientes, Generación de Swagger, Limpieza (Linux/macOS) (+2 more)

### Community 20 - "@nestjs/common"
Cohesion: 0.07
Nodes (12): @nestjs/common, AdminGuard, escapeHtml(), MailService, CreateUserDto, UpdateUserDto, UserResponseDto, UserRole (+4 more)

### Community 22 - "IdEntity"
Cohesion: 0.13
Nodes (3): IdEntity, EvaluationTemplateCriteria, EvaluationTemplate

### Community 23 - "compilerOptions"
Cohesion: 0.09
Nodes (21): exclude, extends, compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators (+13 more)

### Community 24 - "README.md"
Cohesion: 0.17
Nodes (10): Compile and run the project, Deployment, Description, Documentación, License, Project setup, Resources, Run tests (+2 more)

### Community 25 - "BaseResponseDto"
Cohesion: 0.11
Nodes (5): @nestjs/swagger, BaseResponseDto, TreatmentListDto, double, TrialState

### Community 26 - "separator.ts"
Cohesion: 0.10
Nodes (33): API12L_HORIZONTAL_SIZES, api12lWindK(), CriterionResult, calculateSeparator(), clamp01(), estimateGasDensity(), estimateGOR(), SeparatorCriterion (+25 more)

### Community 27 - "thermal-analysis.service.ts"
Cohesion: 0.11
Nodes (23): allPass(), bisect(), checkCriteria(), clampPercent(), DESIGN_VARS, DesignVar, DiagnoseResult, Distribution (+15 more)

### Community 28 - "control.ts"
Cohesion: 0.14
Nodes (25): serialport, calibrate(), ChannelLike, COMMAND_REGEX, evalRule(), isOutput(), OUTPUT_TYPES, outputRange() (+17 more)

### Community 30 - "main.ts"
Cohesion: 0.09
Nodes (17): cookie-parser@^1.4.7, csurf@^1.2.2, helmet@^8.1.0, cookie-parser, csurf, helmet, @nestjs/core, validateEnv() (+9 more)

### Community 31 - "ThermalTreatmentInputDto"
Cohesion: 0.20
Nodes (6): DistributionDto, DistributionsDto, GasCompositionDto, MonteCarloInputDto, ReportRequestDto, ThermalTreatmentInputDto

### Community 32 - "TrialsService"
Cohesion: 0.13
Nodes (3): Trial, TrialSample, TrialsService

### Community 35 - "TreatmentsService"
Cohesion: 0.06
Nodes (4): CalculateTreatmentDto, CreateTreatmentDto, TreatmentsController, TreatmentsService

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "trials.service.ts"
Cohesion: 0.26
Nodes (7): ChannelReading, Device, DeviceChannel, DeviceCommandLog, DeviceRule, double, PidLoop

### Community 40 - "DaysOfWeek"
Cohesion: 0.20
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 42 - "TestController"
Cohesion: 0.06
Nodes (7): CrudRepository, CreateTestDto, TestResponseDto, UpdateTestDto, TestController, TestModule, TestService

### Community 43 - "evaluations.service.ts"
Cohesion: 0.08
Nodes (11): class-transformer, class-validator, EvaluationCriteriaResponseDto, EvaluationResponseDto, EvaluationTemplateResponseDto, ExternalTreatmentResponseDto, EvaluationType, EXTERNAL (+3 more)

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
Cohesion: 0.16
Nodes (7): @nestjs/config, @nestjs/jwt, @nestjs/passport, AuthController, DUMMY_HASH, JwtPayload, JwtStrategy

### Community 53 - "10. Fórmulas de Evaluación"
Cohesion: 0.33
Nodes (6): 10.1 Margen de Cumplimiento, 10.2 Promedio de Cumplimiento, 10.3 Puntaje Ponderado, 10.4 Eficiencia de Separación, 10.5 Eficiencia de Separación (Alternativa), 10. Fórmulas de Evaluación

### Community 54 - "9. Fórmulas de Boquillas"
Cohesion: 0.33
Nodes (6): 9.1 Velocidad en Boquilla de Entrada, 9.2 Diámetro de Boquilla, 9.3 Velocidad en Boquilla de Salida de Crudo, 9.4 Velocidad en Boquilla de Salida de Agua, 9.5 Velocidad en Boquilla de Salida de Gas, 9. Fórmulas de Boquillas

### Community 55 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 57 - ".createEvaluation"
Cohesion: 0.22
Nodes (4): CalculationCriteria, ComparisonOperator, EvaluationCalculationResult, EvaluationCalculatorService

### Community 58 - "Despliegue en Railway"
Cohesion: 0.22
Nodes (9): 1. Proyecto y Postgres, 2. Servicio API, 3. Servicio Web, 4. Verificación, 5. SMTP (después del primer deploy), Despliegue en Railway, Notas, Requisitos (+1 more)

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

### Community 74 - "devices.module.ts"
Cohesion: 0.29
Nodes (3): DevicesModule, DEVICE_ENTITIES, SettingsModule

### Community 76 - "thermal-calculator.service.ts"
Cohesion: 0.12
Nodes (17): API Spec 12L — Vertical and Horizontal Emulsion Treaters, Dónde se aplica en el código, Inconsistencias de la norma y cómo se resolvieron, Normas de referencia, Pendiente, porque falta información de entrada, CompleteApi12lTreatmentOptions1794200000004, API12L_INSULATED_LOSS_FACTOR, API12L_MAX_HEAT_FLUX (+9 more)

### Community 79 - "Scripts de Generación de Cliente API - Termo Lab"
Cohesion: 0.33
Nodes (5): Configuración, Estructura de Archivos Generados, Flujo de Trabajo Recomendado, Notas Importantes, Scripts de Generación de Cliente API - Termo Lab

### Community 80 - "trials.controller.ts"
Cohesion: 0.14
Nodes (10): pdfkit@^0.21.0, pdfkit, ascii(), canonicalJson(), PdfReport, PdfSection, PdfService, TRIAL_ENTITIES (+2 more)

### Community 82 - "Documentación — Termo-Lab API"
Cohesion: 0.40
Nodes (5): Código relacionado con el plan, Documentación — Termo-Lab API, Grafo del código, Hoja de ruta y producto, Referencia técnica en el repositorio

### Community 83 - "simulation-runner.ts"
Cohesion: 0.14
Nodes (17): RunnerService, applyAutoDimension(), EquipmentType, mergeStreamIntoConfig(), pick(), PipelineInput, PipelineResult, PipelineStep (+9 more)

### Community 87 - ".changePassword"
Cohesion: 0.09
Nodes (3): ChangePasswordDto, UpdateProfileDto, ProfileController

### Community 88 - "ChromatographyInputDto"
Cohesion: 0.29
Nodes (4): ChromatographyInputDto, FlashInputDto, FluidPropertiesInputDto, MoleFractionDto

### Community 89 - "equipment.controller.ts"
Cohesion: 0.34
Nodes (5): HeatExchangerFluidDto, HeatExchangerInputDto, SeparatorInputDto, StorageTankInputDto, ThermalTreaterInputDto

### Community 90 - "typeorm"
Cohesion: 0.15
Nodes (3): typeorm, ExternalTreatment, Treatment

### Community 91 - "evaluations.module.ts"
Cohesion: 0.25
Nodes (5): @nestjs/typeorm, EvaluationsModule, TreatmentOptionsModule, TreatmentsModule, UsersModule

### Community 93 - "auth/dto/index.ts"
Cohesion: 0.35
Nodes (4): AuthResponseDto, LoginResponseDto, UserDataDto, RegisterResponseDto

### Community 94 - "QueryBaseDto"
Cohesion: 0.08
Nodes (6): @nestjs/testing@^11.2.8, @nestjs/testing, QueryBaseDto, TreatmentOptionListDto, UpdateTreatmentOptionDto, ALLOWED_SORT

### Community 99 - "eos.ts"
Cohesion: 0.15
Nodes (16): SimulationService, getKij(), PureComponent, calcPhase(), EOS_CONST, EosParams, EosType, lnPhiMix() (+8 more)

### Community 101 - "thermal-twin.service.ts"
Cohesion: 0.22
Nodes (10): calibrate(), CalibrationResult, pilotMass(), sampler(), simulateTwin(), ThermalTwinService, TimeSeries, TwinParams (+2 more)

### Community 107 - "simulation.service.ts"
Cohesion: 0.16
Nodes (20): clamp01(), createInletStream(), ResolvedWater, resolveWaterFractions(), ChromatographyResult, distributeGasPhase(), estimateGOR(), generateChromatography() (+12 more)

### Community 109 - "heat-exchanger.ts"
Cohesion: 0.17
Nodes (12): calcEffectiveness(), calculateHeatExchanger(), estimateShellDiameter(), FlowArrangement, HeatExchangerInput, HeatExchangerResult, calculateStorageTank(), estimateRVP() (+4 more)

## Knowledge Gaps
- **19 isolated node(s):** `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 752 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **42 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `AppSettingsDto`, `devices.dto.ts`, `package.json`, `dependencies`, `treatments.service.ts`, `.generateEvaluationReport`, `app.module.ts`, `thermal-analysis.service.ts`, `control.ts`, `main.ts`, `TestController`, `evaluations.service.ts`, `auth.service.ts`, `.createEvaluation`, `devices.module.ts`, `thermal-calculator.service.ts`, `trials.controller.ts`, `simulation-runner.ts`, `ChromatographyInputDto`, `equipment.controller.ts`, `evaluations.module.ts`, `QueryBaseDto`, `thermal-twin.service.ts`, `simulation.service.ts`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **What connects `MONDAY`, `TUESDAY`, `WEDNESDAY` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppSettingsDto` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/swagger` connect `BaseResponseDto` to `AppSettingsDto`, `devices.dto.ts`, `package.json`, `dependencies`, `LoginDto`, `treatments.service.ts`, `.generateEvaluationReport`, `trials.controller.ts`, `app.module.ts`, `@nestjs/common`, `IdEntity`, `thermal-analysis.service.ts`, `main.ts`, `ThermalTreatmentInputDto`, `trials.service.ts`, `TestController`, `evaluations.service.ts`, `auth.service.ts`, `.createEvaluation`, `thermal-calculator.service.ts`, `trials.controller.ts`, `.changePassword`, `ChromatographyInputDto`, `equipment.controller.ts`, `typeorm`, `AuthService`, `auth/dto/index.ts`, `QueryBaseDto`, `FaceLoginDto`, `SetPasswordDto`, `RegisterDto`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Should `evaluations.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0707070707070707 - nodes in this community are weakly interconnected._
- **Why does `User` connect `User` to `AppSettingsDto`, `evaluations.module.ts`, `UserResponseDto`, `TrialsController`, `treatments.service.ts`, `.generateEvaluationReport`, `@nestjs/common`, `CurrentUser`, `IdEntity`, `Evaluation`, `TreatmentsService`, `evaluations.service.ts`, `bcrypt`, `auth.service.ts`, `.createEvaluation`, `trials.controller.ts`, `.changePassword`, `typeorm`, `AuthService`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `UserResponseDto` be split into smaller, more focused modules?**
  _Cohesion score 0.12807881773399016 - nodes in this community are weakly interconnected._
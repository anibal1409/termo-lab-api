# Graph Report - termo-lab-api  (2026-11-26)

## Corpus Check
- 242 files · ~114,427 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .ino 1)

## Summary
- 2087 nodes · 4826 edges · 140 communities (68 shown, 72 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 155 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c697bda6`
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
- DevicesService
- QueryBaseDto
- scripts
- TreatmentsService
- treatments.service.ts
- additionalProperties
- .generateEvaluationReport
- trials.controller.ts
- app.module.ts
- CreateTreatmentDto
- users.service.ts
- CurrentUser
- typeorm
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
- EvaluationResponseDto
- 1. Fórmulas de Propiedades del Crudo
- 3. Fórmulas de Propiedades del Gas
- openapitools.json
- 11. Fórmulas Adicionales
- 2. Fórmulas de Propiedades del Agua
- 6. Fórmulas de Tiempos de Retención
- 8. Fórmulas de Calor
- index.d.ts
- components.ts
- CreateUnaccentExtension1752379896329
- AddThermalCalculationFields1759797734044
- AddThermalCalculationsToEvaluations1763061460756
- AddTemplateIdToEvaluations1763061460757
- IdCreateEntity
- simulation.service.ts
- thermal-calculator.service.ts
- start-backend-debug.sh
- PdfService
- EvaluationCriteria
- thermal-treater.ts
- simulation-runner.ts
- AddDevices1794006813002
- UsersService
- @nestjs/swagger
- .changePassword
- ChromatographyInputDto
- equipment.controller.ts
- Treatment
- @nestjs/common
- AuthService
- auth/dto/index.ts
- @nestjs/testing
- FaceLoginDto
- trials.controller.ts
- .update
- CreateEvaluationCriteriaDto
- eos.ts
- EquipmentController
- thermal-twin.service.ts
- UpdateProfileDto
- CreateExternalTreatmentDto
- auth.controller.ts
- SetPasswordDto
- MailService
- chromatography.ts
- .simulate
- heat-exchanger.ts
- RegisterDto
- User
- SecurityHardening1794200000000
- PasswordSetupToken1794200000002
- UserPermissionsAndSettings1794200000003
- AppSettings
- guards/index.ts
- storage-tank.ts
- LoginDto
- thermo/index.ts
- EvaluationType

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 81 edges
2. `User` - 69 edges
3. `@nestjs/common` - 63 edges
4. `ThermalCalculatorService` - 62 edges
5. `DevicesService` - 54 edges
6. `typeorm` - 46 edges
7. `CurrentUser` - 41 edges
8. `Evaluation` - 34 edges
9. `TreatmentsService` - 34 edges
10. `class-validator` - 32 edges

## Surprising Connections (you probably didn't know these)
- `Dónde se aplica en el código` --references--> `api12lWindK()`  [INFERRED]
  docs/normas/README.md → src/repositories/evaluations/services/api12l.tables.ts
- `Dónde se aplica en el código` --references--> `api12lFirebox()`  [INFERRED]
  docs/normas/README.md → src/repositories/evaluations/services/api12l.tables.ts
- `lookupNominalHeat_BTUh()` --calls--> `api12lFirebox()`  [EXTRACTED]
  src/repositories/simulation/equipment/thermal-treater.ts → src/repositories/evaluations/services/api12l.tables.ts
- `calculateThermalTreater()` --calls--> `api12lWindK()`  [EXTRACTED]
  src/repositories/simulation/equipment/thermal-treater.ts → src/repositories/evaluations/services/api12l.tables.ts
- `calculateThermalTreater()` --calls--> `api12lFirebox()`  [EXTRACTED]
  src/repositories/simulation/equipment/thermal-treater.ts → src/repositories/evaluations/services/api12l.tables.ts

## Import Cycles
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation.entity.ts -> src/repositories/evaluations/entities/evaluation-criteria.entity.ts`
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation-template.entity.ts -> src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts`

## Communities (140 total, 72 thin omitted)

### Community 0 - "AppSettingsDto"
Cohesion: 0.16
Nodes (5): AppSettingsDto, AppSettingsResponseDto, DEFAULT_SETTINGS, UpdateAppSettingsDto, SettingsService

### Community 1 - "evaluations.module.ts"
Cohesion: 0.07
Nodes (5): CreateTreatmentOptionDto, TreatmentOptionResponseDto, TreatmentOption, TreatmentOptionController, TreatmentOptionService

### Community 4 - "devices.dto.ts"
Cohesion: 0.18
Nodes (11): CreateChannelDto, CreateDeviceDto, CreatePidDto, CreateRuleDto, RawCommandDto, ReadingsQueryDto, UpdateChannelDto, UpdateDeviceDto (+3 more)

### Community 6 - "package.json"
Cohesion: 0.06
Nodes (51): author, description, devDependencies, eslint@^8.0.0, eslint-config-prettier@^9.0.0, eslint-plugin-prettier@^5.0.0, jest@^29.5.0, @nestjs/cli@^10.0.0 (+43 more)

### Community 8 - "dependencies"
Cohesion: 0.05
Nodes (41): dependencies, bcrypt@^6.0.0, class-transformer@^0.5.1, class-validator@^0.14.2, express-session@^1.18.1, jsonwebtoken@^9.0.2, @nestjs/common@^11.1.3, @nestjs/config@^4.0.2 (+33 more)

### Community 11 - "QueryBaseDto"
Cohesion: 0.11
Nodes (6): PaginationDataDto, PaginationDto, QueryBaseDto, pagination(), normalizeText(), QueryTreatmentDto

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 14 - "treatments.service.ts"
Cohesion: 0.13
Nodes (4): CalculateTreatmentDto, TreatmentCalculationsDto, UpdateTreatmentDto, CalculateTreatmentValidationPipe

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - ".generateEvaluationReport"
Cohesion: 0.13
Nodes (6): FORMAT_QUERY, ReportsController, wantsPdf(), EvaluationReportData, ReportGeneratorService, ThermalCalculationResults

### Community 17 - "trials.controller.ts"
Cohesion: 0.12
Nodes (21): AddSampleDto, CalibrateTwinDto, CalibrationResultDto, CalibrationStatusDto, CreateTrialDto, FlightRecorderRow, series(), SeriesValidators() (+13 more)

### Community 18 - "app.module.ts"
Cohesion: 0.12
Nodes (7): @nestjs/serve-static@^5.0.3, @nestjs/serve-static, AppController, AppService, clip(), AuthModule, RepositoriesModule

### Community 20 - "users.service.ts"
Cohesion: 0.13
Nodes (6): CreateUserDto, UpdateUserDto, UserRole, ADMIN, OPERATOR, ALLOWED_SORT

### Community 22 - "typeorm"
Cohesion: 0.08
Nodes (9): typeorm, CreateEvaluationTemplates1751337696278, IdEntity, EvaluationTemplateCriteria, EvaluationTemplate, ExternalTreatment, double, TRIAL_ENTITIES (+1 more)

### Community 23 - "compilerOptions"
Cohesion: 0.09
Nodes (21): exclude, extends, compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators (+13 more)

### Community 24 - "README.md"
Cohesion: 0.05
Nodes (37): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+29 more)

### Community 25 - "BaseResponseDto"
Cohesion: 0.11
Nodes (3): BaseResponseDto, TreatmentOptionListDto, TreatmentListDto

### Community 26 - "separator.ts"
Cohesion: 0.17
Nodes (18): calculateSeparator(), clamp01(), estimateGasDensity(), estimateGOR(), SeparatorCriterion, SeparatorInput, SeparatorOrientation, SeparatorResult (+10 more)

### Community 27 - "thermal-analysis.service.ts"
Cohesion: 0.11
Nodes (23): allPass(), bisect(), checkCriteria(), clampPercent(), DESIGN_VARS, DesignVar, DiagnoseResult, Distribution (+15 more)

### Community 28 - "control.ts"
Cohesion: 0.13
Nodes (26): rxjs, serialport, calibrate(), ChannelLike, COMMAND_REGEX, evalRule(), isOutput(), OUTPUT_TYPES (+18 more)

### Community 30 - "main.ts"
Cohesion: 0.09
Nodes (16): cookie-parser@^1.4.7, csurf@^1.2.2, helmet@^8.1.0, @nestjs/core@^11.1.3, cookie-parser, csurf, helmet, @nestjs/core (+8 more)

### Community 31 - "ThermalTreatmentInputDto"
Cohesion: 0.20
Nodes (6): DistributionDto, DistributionsDto, GasCompositionDto, MonteCarloInputDto, ReportRequestDto, ThermalTreatmentInputDto

### Community 32 - "TrialsService"
Cohesion: 0.13
Nodes (3): Trial, TrialSample, TrialsService

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "trials.service.ts"
Cohesion: 0.23
Nodes (8): ChannelReading, Device, DEVICE_ENTITIES, DeviceChannel, DeviceCommandLog, DeviceRule, double, PidLoop

### Community 40 - "DaysOfWeek"
Cohesion: 0.25
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 42 - "TestController"
Cohesion: 0.05
Nodes (9): CrudRepository, UseCase, CreateTestDto, TestResponseDto, UpdateTestDto, Test, TestController, TestModule (+1 more)

### Community 43 - "evaluations.service.ts"
Cohesion: 0.14
Nodes (3): EvaluationTemplateResponseDto, QueryEvaluationDto, UpdateEvaluationDto

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
Cohesion: 0.21
Nodes (6): @nestjs/config, @nestjs/jwt, @nestjs/passport, DUMMY_HASH, JwtPayload, JwtStrategy

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

### Community 58 - "EvaluationResponseDto"
Cohesion: 0.20
Nodes (3): EvaluationCriteriaResponseDto, EvaluationResponseDto, ExternalTreatmentResponseDto

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

### Community 68 - "components.ts"
Cohesion: 0.04
Nodes (44): BIP, C1, C2, C3, C36P, CO2, COMP_INDEX, H2O (+36 more)

### Community 75 - "simulation.service.ts"
Cohesion: 0.22
Nodes (10): SimulationService, distributeGasPhase(), estimateGOR(), generateChromatography(), getComponentsForChromatography(), whitsonDistribution(), COMPONENT_DB, PureComponent (+2 more)

### Community 76 - "thermal-calculator.service.ts"
Cohesion: 0.14
Nodes (17): API Spec 12L — Vertical and Horizontal Emulsion Treaters, Dónde se aplica en el código, Inconsistencias de la norma y cómo se resolvieron, Normas de referencia, Pendiente, porque falta información de entrada, CompleteApi12lTreatmentOptions1794200000004, API12L_HORIZONTAL_SIZES, API12L_INSULATED_LOSS_FACTOR (+9 more)

### Community 80 - "PdfService"
Cohesion: 0.25
Nodes (7): pdfkit@^0.21.0, pdfkit, ascii(), canonicalJson(), PdfReport, PdfSection, PdfService

### Community 82 - "thermal-treater.ts"
Cohesion: 0.17
Nodes (15): API12L_MAX_HEAT_FLUX, CriterionResult, calculateThermalTreater(), clamp(), clamp01(), estimateFlashGas(), estimateProcessHeat_BTUh(), FILL_OIL (+7 more)

### Community 83 - "simulation-runner.ts"
Cohesion: 0.16
Nodes (16): RunnerService, applyAutoDimension(), EquipmentType, mergeStreamIntoConfig(), pick(), PipelineInput, PipelineResult, PipelineStep (+8 more)

### Community 86 - "@nestjs/swagger"
Cohesion: 0.16
Nodes (4): class-transformer, class-validator, @nestjs/swagger, BaseEntityDto

### Community 88 - "ChromatographyInputDto"
Cohesion: 0.08
Nodes (8): PipelineFeedDto, PipelineStepDto, RunPipelineDto, ChromatographyInputDto, FlashInputDto, FluidPropertiesInputDto, MoleFractionDto, SimulationController

### Community 89 - "equipment.controller.ts"
Cohesion: 0.34
Nodes (5): HeatExchangerFluidDto, HeatExchangerInputDto, SeparatorInputDto, StorageTankInputDto, ThermalTreaterInputDto

### Community 91 - "@nestjs/common"
Cohesion: 0.12
Nodes (12): @nestjs/common, @nestjs/typeorm, DevicesModule, EvaluationsModule, SettingsModule, SimulationModule, UpdateTreatmentOptionDto, TreatmentOptionsModule (+4 more)

### Community 93 - "auth/dto/index.ts"
Cohesion: 0.35
Nodes (4): AuthResponseDto, LoginResponseDto, UserDataDto, RegisterResponseDto

### Community 94 - "@nestjs/testing"
Cohesion: 0.13
Nodes (5): @nestjs/testing@^11.2.8, supertest@^7.0.0, @nestjs/testing, supertest, AppModule

### Community 99 - "eos.ts"
Cohesion: 0.26
Nodes (12): getKij(), calcPhase(), EOS_CONST, EosParams, lnPhiMix(), mixParams(), PhaseResult, pureParams() (+4 more)

### Community 101 - "thermal-twin.service.ts"
Cohesion: 0.36
Nodes (9): calibrate(), CalibrationResult, pilotMass(), sampler(), simulateTwin(), TimeSeries, TwinParams, TwinPoint (+1 more)

### Community 106 - "MailService"
Cohesion: 0.22
Nodes (4): nodemailer@^10.6.1, nodemailer, escapeHtml(), MailService

### Community 107 - "chromatography.ts"
Cohesion: 0.29
Nodes (12): clamp01(), createInletStream(), ResolvedWater, resolveWaterFractions(), ChromatographyResult, chromatographyFromComposition(), estimateGOR(), GasProps (+4 more)

### Community 109 - "heat-exchanger.ts"
Cohesion: 0.31
Nodes (6): calcEffectiveness(), calculateHeatExchanger(), estimateShellDiameter(), FlowArrangement, HeatExchangerInput, HeatExchangerResult

### Community 135 - "guards/index.ts"
Cohesion: 0.29
Nodes (3): MESSAGES, Permission, PermissionGuard()

### Community 136 - "storage-tank.ts"
Cohesion: 0.38
Nodes (5): calculateStorageTank(), estimateRVP(), r(), StorageTankInput, StorageTankResult

### Community 138 - "thermo/index.ts"
Cohesion: 0.50
Nodes (3): estimateGorFromApi(), GasRateResolution, resolveGasRates()

### Community 139 - "EvaluationType"
Cohesion: 0.67
Nodes (3): EvaluationType, EXTERNAL, INTERNAL

## Knowledge Gaps
- **19 isolated node(s):** `ADMIN`, `OPERATOR`, `FRIDAY`, `MONDAY`, `SATURDAY` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 782 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **72 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `AppSettingsDto`, `ThermalCalculatorService`, `devices.dto.ts`, `package.json`, `guards/index.ts`, `dependencies`, `treatments.service.ts`, `.generateEvaluationReport`, `trials.controller.ts`, `app.module.ts`, `users.service.ts`, `thermal-analysis.service.ts`, `control.ts`, `main.ts`, `TestController`, `evaluations.service.ts`, `auth.service.ts`, `.createEvaluation`, `simulation.service.ts`, `thermal-calculator.service.ts`, `PdfService`, `simulation-runner.ts`, `ChromatographyInputDto`, `equipment.controller.ts`, `@nestjs/testing`, `trials.controller.ts`, `thermal-twin.service.ts`, `UpdateProfileDto`, `auth.controller.ts`, `MailService`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **What connects `ADMIN`, `OPERATOR`, `FRIDAY` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `evaluations.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0707070707070707 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `AppSettingsDto`, `devices.dto.ts`, `package.json`, `dependencies`, `QueryBaseDto`, `treatments.service.ts`, `trials.controller.ts`, `users.service.ts`, `typeorm`, `BaseResponseDto`, `thermal-analysis.service.ts`, `main.ts`, `ThermalTreatmentInputDto`, `trials.service.ts`, `TestController`, `evaluations.service.ts`, `.createEvaluation`, `IdCreateEntity`, `thermal-calculator.service.ts`, `ChromatographyInputDto`, `equipment.controller.ts`, `@nestjs/common`, `auth/dto/index.ts`, `@nestjs/testing`, `FaceLoginDto`, `trials.controller.ts`, `UpdateProfileDto`, `auth.controller.ts`, `SetPasswordDto`, `RegisterDto`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Should `UserResponseDto` be split into smaller, more focused modules?**
  _Cohesion score 0.12807881773399016 - nodes in this community are weakly interconnected._
- **Why does `typeorm` connect `typeorm` to `AppSettingsDto`, `package.json`, `dependencies`, `treatments.service.ts`, `trials.controller.ts`, `users.service.ts`, `control.ts`, `trials.service.ts`, `TestController`, `evaluations.service.ts`, `bcrypt`, `AddTrials1794021872972`, `SeedTrialAndDeviceData1794021872973`, `auth.service.ts`, `SeedTreatmentOptions1751181394026`, `CreateUnaccentExtension1752379896329`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `thermal-calculator.service.ts`, `simulation-runner.ts`, `AddDevices1794006813002`, `Treatment`, `@nestjs/common`, `SecurityHardening1794200000000`, `PasswordSetupToken1794200000002`, `UserPermissionsAndSettings1794200000003`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `ThermalCalculatorService` be split into smaller, more focused modules?**
  _Cohesion score 0.08408163265306122 - nodes in this community are weakly interconnected._
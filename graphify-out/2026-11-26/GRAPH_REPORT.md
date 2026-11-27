# Graph Report - termo-lab-api  (2026-11-26)

## Corpus Check
- 241 files · ~113,159 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .ino 1)

## Summary
- 2080 nodes · 4809 edges · 123 communities (61 shown, 62 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 153 edges (avg confidence: 0.85)
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
- thermal-treater.ts
- thermal-analysis.service.ts
- control.ts
- Evaluation
- main.ts
- ThermalTreatmentInputDto
- QueryTreatmentDto
- evaluations.service.ts
- ThermalCalculationsController
- TreatmentResponseDto
- .faceLogin
- 4. Fórmulas de Flujos y Caudales
- trials.service.ts
- SerialConnection
- DaysOfWeek
- CreateTemplateCriteriaDto
- TestController
- CreateEvaluationTemplates1751337696278
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
- @nestjs/testing
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
- thermal-calculator.service.ts
- start-backend-debug.sh
- PdfService
- EvaluationCriteria
- simulation-runner.ts
- AddDevices1794006813002
- UsersService
- class-validator
- .changePassword
- PipelineFeedDto
- SimulationController
- Treatment
- @nestjs/common
- AuthService
- auth/dto/index.ts
- FaceLoginDto
- trials.controller.ts
- SimulationService
- ChromatographyInputDto
- UpdateProfileDto
- SetPasswordDto
- MailService
- chromatography.ts
- RegisterDto
- SecurityHardening1794200000000
- PasswordSetupToken1794200000002
- UserPermissionsAndSettings1794200000003

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
- `ThermalTreatmentInputDto` --implements--> `ThermalTreatmentInput`  [EXTRACTED]
  src/repositories/evaluations/dto/thermal-input.dto.ts → src/repositories/evaluations/services/thermal-calculator.service.ts
- `DesignVar` --references--> `ThermalTreatmentInput`  [EXTRACTED]
  src/repositories/evaluations/services/thermal-analysis.service.ts → src/repositories/evaluations/services/thermal-calculator.service.ts
- `MonteCarloInput` --references--> `ThermalTreatmentInput`  [EXTRACTED]
  src/repositories/evaluations/services/thermal-analysis.service.ts → src/repositories/evaluations/services/thermal-calculator.service.ts
- `Evaluation` --references--> `User`  [EXTRACTED]
  src/repositories/evaluations/entities/evaluation.entity.ts → src/repositories/users/entities/user.entity.ts
- `Treatment` --references--> `User`  [EXTRACTED]
  src/repositories/treatments/entities/treatment.entity.ts → src/repositories/users/entities/user.entity.ts

## Import Cycles
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation.entity.ts -> src/repositories/evaluations/entities/evaluation-criteria.entity.ts`
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation-template.entity.ts -> src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts`

## Communities (123 total, 62 thin omitted)

### Community 0 - "AppSettingsDto"
Cohesion: 0.07
Nodes (10): MESSAGES, Permission, PermissionGuard(), SettingsController, AppSettingsDto, AppSettingsResponseDto, DEFAULT_SETTINGS, UpdateAppSettingsDto (+2 more)

### Community 1 - "evaluations.module.ts"
Cohesion: 0.05
Nodes (10): CrudRepository, UseCase, CreateTreatmentOptionDto, TreatmentOptionListDto, TreatmentOptionResponseDto, UpdateTreatmentOptionDto, TreatmentOption, TreatmentOptionController (+2 more)

### Community 4 - "devices.dto.ts"
Cohesion: 0.17
Nodes (11): CreateChannelDto, CreateDeviceDto, CreatePidDto, CreateRuleDto, RawCommandDto, ReadingsQueryDto, UpdateChannelDto, UpdateDeviceDto (+3 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (54): author, description, devDependencies, eslint@^8.0.0, eslint-config-prettier@^9.0.0, eslint-plugin-prettier@^5.0.0, jest@^29.5.0, @nestjs/cli@^10.0.0 (+46 more)

### Community 7 - "TrialsController"
Cohesion: 0.06
Nodes (14): calibrate(), CalibrationResult, pilotMass(), sampler(), simulateTwin(), ThermalTwinService, TimeSeries, TwinParams (+6 more)

### Community 8 - "dependencies"
Cohesion: 0.05
Nodes (44): dependencies, class-validator@^0.14.2, express-session@^1.18.1, jsonwebtoken@^9.0.2, @nestjs/common@^11.1.3, @nestjs/config@^4.0.2, @nestjs/jwt@^11.0.0, @nestjs/passport@^11.0.5 (+36 more)

### Community 11 - "QueryBaseDto"
Cohesion: 0.10
Nodes (6): PaginationDataDto, PaginationDto, QueryBaseDto, pagination(), normalizeText(), QueryEvaluationDto

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 14 - "treatments.service.ts"
Cohesion: 0.12
Nodes (4): CalculateTreatmentDto, TreatmentCalculationsDto, UpdateTreatmentDto, CalculateTreatmentValidationPipe

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - ".generateEvaluationReport"
Cohesion: 0.14
Nodes (5): FORMAT_QUERY, ReportsController, wantsPdf(), ReportGeneratorService, ThermalCalculationResults

### Community 17 - "trials.controller.ts"
Cohesion: 0.12
Nodes (21): AddSampleDto, CalibrateTwinDto, CalibrationResultDto, CalibrationStatusDto, CreateTrialDto, FlightRecorderRow, series(), SeriesValidators() (+13 more)

### Community 18 - "app.module.ts"
Cohesion: 0.09
Nodes (7): @nestjs/testing, AppController, AppModule, AppService, clip(), AuthModule, RepositoriesModule

### Community 20 - "users.service.ts"
Cohesion: 0.10
Nodes (6): AdminGuard, CreateUserDto, UserRole, ADMIN, OPERATOR, ALLOWED_SORT

### Community 21 - "CurrentUser"
Cohesion: 0.15
Nodes (3): CurrentUser, EvaluationsController, User

### Community 22 - "typeorm"
Cohesion: 0.11
Nodes (7): @nestjs/swagger, typeorm, IdEntity, EvaluationTemplateCriteria, double, TRIAL_ENTITIES, TrialState

### Community 23 - "compilerOptions"
Cohesion: 0.09
Nodes (21): exclude, extends, compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators (+13 more)

### Community 24 - "README.md"
Cohesion: 0.05
Nodes (37): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+29 more)

### Community 26 - "thermal-treater.ts"
Cohesion: 0.06
Nodes (48): CriterionResult, HeatExchangerFluidDto, HeatExchangerInputDto, SeparatorInputDto, StorageTankInputDto, ThermalTreaterInputDto, EquipmentController, calcEffectiveness() (+40 more)

### Community 27 - "thermal-analysis.service.ts"
Cohesion: 0.11
Nodes (21): allPass(), bisect(), checkCriteria(), clampPercent(), DESIGN_VARS, DiagnoseResult, Distribution, effectiveWaterCut() (+13 more)

### Community 28 - "control.ts"
Cohesion: 0.13
Nodes (26): serialport@^13.0.0, rxjs, serialport, calibrate(), ChannelLike, COMMAND_REGEX, evalRule(), OUTPUT_TYPES (+18 more)

### Community 29 - "Evaluation"
Cohesion: 0.10
Nodes (4): Evaluation, EvaluationTemplate, EvaluationCalculatorService, EvaluationsService

### Community 30 - "main.ts"
Cohesion: 0.10
Nodes (15): cookie-parser@^1.4.7, csurf@^1.2.2, helmet@^8.1.0, @nestjs/core@^11.1.3, cookie-parser, csurf, helmet, @nestjs/core (+7 more)

### Community 31 - "ThermalTreatmentInputDto"
Cohesion: 0.20
Nodes (6): DistributionDto, DistributionsDto, GasCompositionDto, MonteCarloInputDto, ReportRequestDto, ThermalTreatmentInputDto

### Community 33 - "evaluations.service.ts"
Cohesion: 0.06
Nodes (6): CreateEvaluationCriteriaDto, CreateEvaluationDto, CreateExternalTreatmentDto, EvaluationTemplateResponseDto, UpdateEvaluationDto, ExtendedCriteriaDto

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "trials.service.ts"
Cohesion: 0.17
Nodes (9): ChannelReading, Device, DEVICE_ENTITIES, DeviceChannel, DeviceCommandLog, DeviceRule, double, PidLoop (+1 more)

### Community 40 - "DaysOfWeek"
Cohesion: 0.25
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 42 - "TestController"
Cohesion: 0.05
Nodes (8): BaseEntityDto, CreateTestDto, TestResponseDto, UpdateTestDto, Test, TestController, TestModule, TestService

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
Cohesion: 0.15
Nodes (7): bcrypt@^6.0.0, bcrypt, seedPassword(), SeedAdminAndOperatorUsers1751178224375, UpdateUserPasswords1759794383734, SeedAllModules1794108000000, RotateDefaultPasswords1794200000001

### Community 50 - "Fórmulas Implementadas en el Sistema Termo-Lab"
Cohesion: 0.33
Nodes (6): Backend (termo-lab-api), Fórmulas Implementadas en el Sistema Termo-Lab, 📝 Notas Importantes, 🔍 Referencias, 📊 Resumen de Archivos, 📋 Índice

### Community 51 - "7. Fórmulas de Decantación"
Cohesion: 0.29
Nodes (7): 7.1 Velocidad de Decantación de la Fase Pesada (Ecuación 1.22), 7.2 Tiempo de Decantación de la Fase Pesada (Ecuación 1.23), 7.3 Tiempo de Decantación de la Fase Liviana (Ecuación 1.24 / Ec. 33), 7.4 Porcentaje de Deshidratación del Equipo (Ecuación 1.19 / Ec. 28), 7.5 Cantidad de Agua Saliendo con el Crudo (Ecuación 1.18 / Ec. 27), 7.6 Corte de Agua del Crudo Saliendo (Ecuación 1.13 / Ec. 23), 7. Fórmulas de Decantación

### Community 52 - "auth.service.ts"
Cohesion: 0.18
Nodes (7): @nestjs/config, @nestjs/jwt, @nestjs/passport, DUMMY_HASH, RegisterResponseDto, JwtPayload, JwtStrategy

### Community 53 - "10. Fórmulas de Evaluación"
Cohesion: 0.33
Nodes (6): 10.1 Margen de Cumplimiento, 10.2 Promedio de Cumplimiento, 10.3 Puntaje Ponderado, 10.4 Eficiencia de Separación, 10.5 Eficiencia de Separación (Alternativa), 10. Fórmulas de Evaluación

### Community 54 - "9. Fórmulas de Boquillas"
Cohesion: 0.33
Nodes (6): 9.1 Velocidad en Boquilla de Entrada, 9.2 Diámetro de Boquilla, 9.3 Velocidad en Boquilla de Salida de Crudo, 9.4 Velocidad en Boquilla de Salida de Agua, 9.5 Velocidad en Boquilla de Salida de Gas, 9. Fórmulas de Boquillas

### Community 55 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 57 - "@nestjs/testing"
Cohesion: 0.33
Nodes (3): CalculationCriteria, ComparisonOperator, EvaluationCalculationResult

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

### Community 76 - "thermal-calculator.service.ts"
Cohesion: 0.13
Nodes (16): CompleteApi12lTreatmentOptions1794200000004, API12L_HORIZONTAL_SIZES, API12L_INSULATED_LOSS_FACTOR, API12L_MAX_HEAT_FLUX, API12L_MAX_OIL_VISCOSITY_CP, API12L_VERTICAL_SIZES, api12lFirebox(), Api12lSize (+8 more)

### Community 80 - "PdfService"
Cohesion: 0.47
Nodes (3): ascii(), canonicalJson(), PdfService

### Community 81 - "EvaluationCriteria"
Cohesion: 0.14
Nodes (3): CreateSampleEvaluations1751337651990, EvaluationCriteria, ExternalTreatment

### Community 83 - "simulation-runner.ts"
Cohesion: 0.16
Nodes (16): RunnerService, applyAutoDimension(), EquipmentType, mergeStreamIntoConfig(), pick(), PipelineInput, PipelineResult, PipelineStep (+8 more)

### Community 85 - "UsersService"
Cohesion: 0.21
Nodes (3): UpdateUserDto, UserResponseDto, UsersService

### Community 86 - "class-validator"
Cohesion: 0.13
Nodes (7): class-transformer@^0.5.1, class-transformer, class-validator, LoginDto, EvaluationType, EXTERNAL, INTERNAL

### Community 88 - "PipelineFeedDto"
Cohesion: 0.18
Nodes (3): PipelineFeedDto, PipelineStepDto, RunPipelineDto

### Community 91 - "@nestjs/common"
Cohesion: 0.17
Nodes (9): @nestjs/common, @nestjs/typeorm, IS_PUBLIC_KEY, DevicesModule, EvaluationsModule, TreatmentOptionsModule, TreatmentsModule, TrialsModule (+1 more)

### Community 93 - "auth/dto/index.ts"
Cohesion: 0.29
Nodes (4): AuthResponseDto, LoginResponseDto, UserDataDto, LogoutResponseDto

### Community 99 - "SimulationService"
Cohesion: 0.15
Nodes (18): SimulationModule, SimulationService, getComponentsForChromatography(), getKij(), PureComponent, calcPhase(), EOS_CONST, EosParams (+10 more)

### Community 100 - "ChromatographyInputDto"
Cohesion: 0.29
Nodes (4): ChromatographyInputDto, FlashInputDto, FluidPropertiesInputDto, MoleFractionDto

### Community 107 - "chromatography.ts"
Cohesion: 0.16
Nodes (20): clamp01(), createInletStream(), ResolvedWater, resolveWaterFractions(), ChromatographyResult, distributeGasPhase(), estimateGOR(), generateChromatography() (+12 more)

## Knowledge Gaps
- **19 isolated node(s):** `ADMIN`, `OPERATOR`, `FRIDAY`, `MONDAY`, `SATURDAY` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 780 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **62 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `AppSettingsDto`, `evaluations.module.ts`, `devices.dto.ts`, `package.json`, `TrialsController`, `dependencies`, `treatments.service.ts`, `app.module.ts`, `users.service.ts`, `thermal-treater.ts`, `thermal-analysis.service.ts`, `control.ts`, `main.ts`, `evaluations.service.ts`, `trials.service.ts`, `TestController`, `auth.service.ts`, `@nestjs/testing`, `thermal-calculator.service.ts`, `simulation-runner.ts`, `trials.controller.ts`, `SimulationService`, `ChromatographyInputDto`, `MailService`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **What connects `ADMIN`, `OPERATOR`, `FRIDAY` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppSettingsDto` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/swagger` connect `typeorm` to `AppSettingsDto`, `evaluations.module.ts`, `devices.dto.ts`, `package.json`, `dependencies`, `QueryBaseDto`, `treatments.service.ts`, `trials.controller.ts`, `app.module.ts`, `users.service.ts`, `thermal-treater.ts`, `thermal-analysis.service.ts`, `main.ts`, `ThermalTreatmentInputDto`, `evaluations.service.ts`, `trials.service.ts`, `TestController`, `auth.service.ts`, `@nestjs/testing`, `thermal-calculator.service.ts`, `class-validator`, `auth/dto/index.ts`, `trials.controller.ts`, `ChromatographyInputDto`, `UpdateProfileDto`, `SetPasswordDto`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Should `evaluations.module.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05333333333333334 - nodes in this community are weakly interconnected._
- **Why does `typeorm` connect `typeorm` to `AppSettingsDto`, `evaluations.module.ts`, `package.json`, `dependencies`, `treatments.service.ts`, `users.service.ts`, `control.ts`, `evaluations.service.ts`, `trials.service.ts`, `TestController`, `bcrypt`, `AddTrials1794021872972`, `SeedTrialAndDeviceData1794021872973`, `auth.service.ts`, `SeedTreatmentOptions1751181394026`, `CreateUnaccentExtension1752379896329`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `thermal-calculator.service.ts`, `EvaluationCriteria`, `simulation-runner.ts`, `AddDevices1794006813002`, `Treatment`, `SecurityHardening1794200000000`, `PasswordSetupToken1794200000002`, `UserPermissionsAndSettings1794200000003`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Should `UserResponseDto` be split into smaller, more focused modules?**
  _Cohesion score 0.12807881773399016 - nodes in this community are weakly interconnected._
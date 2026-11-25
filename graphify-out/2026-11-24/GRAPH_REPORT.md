# Graph Report - termo-lab-api  (2026-11-24)

## Corpus Check
- 215 files · ~98,559 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .ino 1)

## Summary
- 1801 nodes · 4197 edges · 106 communities (57 shown, 49 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 142 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33d23ec6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- TreatmentOptionController
- TreatmentOptionResponseDto
- UserResponseDto
- ThermalCalculatorService
- devices.dto.ts
- DevicesController
- package.json
- trials.controller.ts
- dependencies
- TreatmentsService
- DevicesService
- QueryBaseDto
- scripts
- evaluations.service.ts
- treatments.service.ts
- additionalProperties
- ThermalTreatmentInput
- TreatmentOptionService
- app.module.ts
- treatment-options.service.ts
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
- CreateTreatmentDto
- CreateExternalTreatmentDto
- CreateEvaluationDto
- ThermalCalculationsController
- TreatmentResponseDto
- auth.service.ts
- 4. Fórmulas de Flujos y Caudales
- trials.service.ts
- SerialConnection
- DaysOfWeek
- CreateTemplateCriteriaDto
- TestController
- TestResponseDto
- 5. Fórmulas de Áreas y Volúmenes
- jest
- TestService
- users/entities/index.ts
- AddTrials1794021872972
- SeedTrialAndDeviceData1794021872973
- Fórmulas Implementadas en el Sistema Termo-Lab
- 7. Fórmulas de Decantación
- generate-swagger.ts
- 10. Fórmulas de Evaluación
- 9. Fórmulas de Boquillas
- nest-cli.json
- SeedTreatmentOptions1751181394026
- @nestjs/testing
- evaluation-response.dto.ts
- 1. Fórmulas de Propiedades del Crudo
- 3. Fórmulas de Propiedades del Gas
- openapitools.json
- 11. Fórmulas Adicionales
- 2. Fórmulas de Propiedades del Agua
- 6. Fórmulas de Tiempos de Retención
- 8. Fórmulas de Calor
- test.service.ts
- index.d.ts
- components.ts
- CreateUnaccentExtension1752379896329
- AddThermalCalculationFields1759797734044
- AddThermalCalculationsToEvaluations1763061460756
- AddTemplateIdToEvaluations1763061460757
- IdCreateEntity
- Test
- @nestjs/common
- Treatment
- start-backend-debug.sh
- simulation.controller.ts
- CreateTreatmentOptionDto
- EvaluationCriteria
- CreateUserDto
- simulation-runner.ts
- AddDevices1794006813002
- UsersService
- @nestjs/swagger
- .changePassword
- QueryEvaluationDto
- CrudRepository
- repositories.module.ts
- SeedAllModules1794108000000
- BaseEntityDto
- CreateTestDto
- equipment.controller.ts
- SimulationController
- eos.ts
- Public
- CreateEvaluationCriteriaDto
- SimulationService
- PipelineFeedDto
- UpdateProfileDto
- heat-exchanger.ts
- EvaluationType
- chromatography.ts

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 74 edges
2. `ThermalCalculatorService` - 63 edges
3. `User` - 60 edges
4. `@nestjs/common` - 54 edges
5. `DevicesService` - 54 edges
6. `typeorm` - 38 edges
7. `TreatmentsService` - 36 edges
8. `Evaluation` - 32 edges
9. `CurrentUser` - 31 edges
10. `IdEntity` - 31 edges

## Surprising Connections (you probably didn't know these)
- `ExtendedCriteriaDto` --inherits--> `CreateEvaluationCriteriaDto`  [EXTRACTED]
  src/repositories/evaluations/services/evaluations.service.ts → src/repositories/evaluations/dto/create-evaluation-criteria.dto.ts
- `DesignVar` --references--> `ThermalTreatmentInput`  [EXTRACTED]
  src/repositories/evaluations/services/thermal-analysis.service.ts → src/repositories/evaluations/services/thermal-calculator.service.ts
- `QueryEvaluationDto` --inherits--> `QueryBaseDto`  [EXTRACTED]
  src/repositories/evaluations/dto/query-evaluation.dto.ts → src/common/pagination/dto/query-base.dto.ts
- `TestService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/test/test.service.ts → src/common/use-case/crud-repository.ts
- `TreatmentOptionService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/treatment-options/treatment-options.service.ts → src/common/use-case/crud-repository.ts

## Import Cycles
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation.entity.ts -> src/repositories/evaluations/entities/evaluation-criteria.entity.ts`
- 2-file cycle: `src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts -> src/repositories/evaluations/entities/evaluation-template.entity.ts -> src/repositories/evaluations/entities/evaluation-template-criteria.entity.ts`

## Communities (106 total, 49 thin omitted)

### Community 4 - "devices.dto.ts"
Cohesion: 0.14
Nodes (16): rxjs, PidState, CreateChannelDto, CreateDeviceDto, CreatePidDto, CreateRuleDto, RawCommandDto, ReadingsQueryDto (+8 more)

### Community 6 - "package.json"
Cohesion: 0.06
Nodes (48): author, description, devDependencies, eslint@^8.0.0, eslint-config-prettier@^9.0.0, eslint-plugin-prettier@^5.0.0, jest@^29.5.0, @nestjs/cli@^10.0.0 (+40 more)

### Community 7 - "trials.controller.ts"
Cohesion: 0.07
Nodes (21): @nestjs/typeorm, calibrate(), CalibrationResult, interpolate(), pilotMass(), simulateTwin(), ThermalTwinService, TimeSeries (+13 more)

### Community 8 - "dependencies"
Cohesion: 0.05
Nodes (39): dependencies, class-transformer@^0.5.1, class-validator@^0.14.2, express-session@^1.18.1, jsonwebtoken@^9.0.2, @nestjs/common@^11.1.3, @nestjs/config@^4.0.2, @nestjs/jwt@^11.0.0 (+31 more)

### Community 10 - "DevicesService"
Cohesion: 0.10
Nodes (5): evalRule(), isOutput(), writeCommand(), DevicesService, pinNumber()

### Community 11 - "QueryBaseDto"
Cohesion: 0.11
Nodes (6): PaginationDataDto, PaginationDto, QueryBaseDto, pagination(), normalizeText(), QueryTreatmentDto

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 13 - "evaluations.service.ts"
Cohesion: 0.26
Nodes (3): EvaluationTemplateResponseDto, UpdateEvaluationDto, ExtendedCriteriaDto

### Community 14 - "treatments.service.ts"
Cohesion: 0.21
Nodes (3): TreatmentCalculationsDto, UpdateTreatmentDto, CalculateTreatmentValidationPipe

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - "ThermalTreatmentInput"
Cohesion: 0.21
Nodes (4): ReportsController, ReportGeneratorService, ThermalCalculationResults, ThermalTreatmentInput

### Community 21 - "CurrentUser"
Cohesion: 0.15
Nodes (3): CurrentUser, EvaluationsController, User

### Community 22 - "typeorm"
Cohesion: 0.11
Nodes (5): typeorm, CreateEvaluationTemplates1751337696278, IdEntity, EvaluationTemplateCriteria, EvaluationTemplate

### Community 23 - "compilerOptions"
Cohesion: 0.09
Nodes (21): exclude, extends, compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators (+13 more)

### Community 24 - "README.md"
Cohesion: 0.05
Nodes (37): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+29 more)

### Community 25 - "BaseResponseDto"
Cohesion: 0.13
Nodes (3): BaseResponseDto, TreatmentOptionListDto, TreatmentListDto

### Community 26 - "thermal-treater.ts"
Cohesion: 0.13
Nodes (26): CriterionResult, calculateSeparator(), clamp01(), estimateGasDensity(), estimateGOR(), SeparatorCriterion, SeparatorInput, SeparatorOrientation (+18 more)

### Community 27 - "thermal-analysis.service.ts"
Cohesion: 0.11
Nodes (21): allPass(), bisect(), checkCriteria(), clampPercent(), DESIGN_VARS, DesignVar, DiagnoseResult, Distribution (+13 more)

### Community 28 - "control.ts"
Cohesion: 0.10
Nodes (24): calibrate(), ChannelLike, ChannelType, ANALOG_IN, DIGITAL_IN, DIGITAL_OUT, DS18B20, MAX31865 (+16 more)

### Community 29 - "Evaluation"
Cohesion: 0.12
Nodes (3): Evaluation, EvaluationCalculatorService, EvaluationsService

### Community 30 - "main.ts"
Cohesion: 0.10
Nodes (13): cookie-parser@^1.4.7, csurf@^1.2.2, helmet@^8.1.0, @nestjs/core@^11.1.3, cookie-parser, csurf, helmet, @nestjs/core (+5 more)

### Community 36 - "auth.service.ts"
Cohesion: 0.05
Nodes (16): @nestjs/config, @nestjs/jwt, @nestjs/passport, AuthController, AuthService, AuthResponseDto, EnrollFaceDto, FaceLoginDto (+8 more)

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "trials.service.ts"
Cohesion: 0.23
Nodes (7): ChannelReading, Device, DeviceChannel, DeviceCommandLog, DeviceRule, double, PidLoop

### Community 39 - "SerialConnection"
Cohesion: 0.15
Nodes (7): serialport@^13.0.0, @serialport/parser-readline@^13.0.0, serialport, @serialport/parser-readline, COMMAND_REGEX, ConnectionHandlers, SerialConnection

### Community 40 - "DaysOfWeek"
Cohesion: 0.15
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 44 - "5. Fórmulas de Áreas y Volúmenes"
Cohesion: 0.22
Nodes (9): 5.1 Área Total del Recipiente (Ecuación 1.10), 5.2 Área desde el Fondo al Nivel Bajo Bajo de Agua (Ecuación 1.9), 5.3 Área Ocupada por el Agua (Ecuación 1.17 / Ec. 26), 5.4 Área Ocupada por el Crudo (Ecuación 1.4 / Ec. 13), 5.5 Área Disponible para el Gas (Ecuación 1.11), 5.6 Área Requerida para el Gas (Ecuación 1.15 / Ec. 25), 5.7 Volumen de Retención del Crudo (Ecuación 1.5), 5.8 Volumen de Retención del Agua (Ecuación 1.12) (+1 more)

### Community 45 - "jest"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 47 - "users/entities/index.ts"
Cohesion: 0.11
Nodes (8): bcrypt@^6.0.0, bcrypt, AdminGuard, SeedAdminAndOperatorUsers1751178224375, UpdateUserPasswords1759794383734, UserRole, ADMIN, OPERATOR

### Community 50 - "Fórmulas Implementadas en el Sistema Termo-Lab"
Cohesion: 0.33
Nodes (6): Backend (termo-lab-api), Fórmulas Implementadas en el Sistema Termo-Lab, 📝 Notas Importantes, 🔍 Referencias, 📊 Resumen de Archivos, 📋 Índice

### Community 51 - "7. Fórmulas de Decantación"
Cohesion: 0.29
Nodes (7): 7.1 Velocidad de Decantación de la Fase Pesada (Ecuación 1.22), 7.2 Tiempo de Decantación de la Fase Pesada (Ecuación 1.23), 7.3 Tiempo de Decantación de la Fase Liviana (Ecuación 1.24 / Ec. 33), 7.4 Porcentaje de Deshidratación del Equipo (Ecuación 1.19 / Ec. 28), 7.5 Cantidad de Agua Saliendo con el Crudo (Ecuación 1.18 / Ec. 27), 7.6 Corte de Agua del Crudo Saliendo (Ecuación 1.13 / Ec. 23), 7. Fórmulas de Decantación

### Community 52 - "generate-swagger.ts"
Cohesion: 0.19
Nodes (4): supertest@^7.0.0, supertest, AppModule, AuthModule

### Community 53 - "10. Fórmulas de Evaluación"
Cohesion: 0.33
Nodes (6): 10.1 Margen de Cumplimiento, 10.2 Promedio de Cumplimiento, 10.3 Puntaje Ponderado, 10.4 Eficiencia de Separación, 10.5 Eficiencia de Separación (Alternativa), 10. Fórmulas de Evaluación

### Community 54 - "9. Fórmulas de Boquillas"
Cohesion: 0.33
Nodes (6): 9.1 Velocidad en Boquilla de Entrada, 9.2 Diámetro de Boquilla, 9.3 Velocidad en Boquilla de Salida de Crudo, 9.4 Velocidad en Boquilla de Salida de Agua, 9.5 Velocidad en Boquilla de Salida de Gas, 9. Fórmulas de Boquillas

### Community 55 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 58 - "evaluation-response.dto.ts"
Cohesion: 0.19
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

### Community 75 - "@nestjs/common"
Cohesion: 0.23
Nodes (5): @nestjs/common, CalculationCriteria, ComparisonOperator, EvaluationCalculationResult, EvaluationReportData

### Community 79 - "simulation.controller.ts"
Cohesion: 0.39
Nodes (3): ChromatographyInputDto, FlashInputDto, FluidPropertiesInputDto

### Community 81 - "EvaluationCriteria"
Cohesion: 0.13
Nodes (3): CreateSampleEvaluations1751337651990, EvaluationCriteria, ExternalTreatment

### Community 83 - "simulation-runner.ts"
Cohesion: 0.17
Nodes (19): calculateStorageTank(), estimateRVP(), r(), StorageTankInput, StorageTankResult, EquipmentType, mergeStreamIntoConfig(), pick() (+11 more)

### Community 86 - "@nestjs/swagger"
Cohesion: 0.29
Nodes (3): class-transformer, class-validator, @nestjs/swagger

### Community 90 - "repositories.module.ts"
Cohesion: 0.11
Nodes (8): DevicesModule, EvaluationsModule, RepositoriesModule, SimulationModule, TreatmentOptionsModule, TreatmentsModule, TrialsModule, UsersModule

### Community 94 - "equipment.controller.ts"
Cohesion: 0.34
Nodes (5): HeatExchangerFluidDto, HeatExchangerInputDto, SeparatorInputDto, StorageTankInputDto, ThermalTreaterInputDto

### Community 96 - "eos.ts"
Cohesion: 0.33
Nodes (9): getKij(), calcPhase(), EOS_CONST, EosParams, lnPhiMix(), mixParams(), PhaseResult, pureParams() (+1 more)

### Community 99 - "SimulationService"
Cohesion: 0.22
Nodes (9): SimulationService, getComponentsForChromatography(), COMPONENT_DB, PureComponent, EosType, wilsonK(), flashPT(), FlashResult (+1 more)

### Community 100 - "PipelineFeedDto"
Cohesion: 0.18
Nodes (3): PipelineFeedDto, PipelineStepDto, RunPipelineDto

### Community 103 - "heat-exchanger.ts"
Cohesion: 0.28
Nodes (6): calcEffectiveness(), calculateHeatExchanger(), estimateShellDiameter(), FlowArrangement, HeatExchangerInput, HeatExchangerResult

### Community 104 - "EvaluationType"
Cohesion: 0.67
Nodes (3): EvaluationType, EXTERNAL, INTERNAL

### Community 107 - "chromatography.ts"
Cohesion: 0.24
Nodes (13): clamp01(), createInletStream(), ResolvedWater, resolveWaterFractions(), ChromatographyResult, distributeGasPhase(), estimateGOR(), generateChromatography() (+5 more)

## Knowledge Gaps
- **19 isolated node(s):** `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 668 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **49 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `devices.dto.ts`, `package.json`, `trials.controller.ts`, `dependencies`, `evaluations.service.ts`, `treatments.service.ts`, `app.module.ts`, `treatment-options.service.ts`, `users.service.ts`, `thermal-analysis.service.ts`, `Evaluation`, `main.ts`, `auth.service.ts`, `SerialConnection`, `users/entities/index.ts`, `generate-swagger.ts`, `test.service.ts`, `simulation.controller.ts`, `simulation-runner.ts`, `repositories.module.ts`, `equipment.controller.ts`, `SimulationService`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **What connects `MONDAY`, `TUESDAY`, `WEDNESDAY` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UserResponseDto` be split into smaller, more focused modules?**
  _Cohesion score 0.13105413105413105 - nodes in this community are weakly interconnected._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `devices.dto.ts`, `package.json`, `trials.controller.ts`, `dependencies`, `evaluations.service.ts`, `treatments.service.ts`, `treatment-options.service.ts`, `users.service.ts`, `typeorm`, `BaseResponseDto`, `thermal-analysis.service.ts`, `main.ts`, `auth.service.ts`, `trials.service.ts`, `generate-swagger.ts`, `evaluation-response.dto.ts`, `test.service.ts`, `IdCreateEntity`, `@nestjs/common`, `simulation.controller.ts`, `BaseEntityDto`, `equipment.controller.ts`, `PipelineFeedDto`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Should `ThermalCalculatorService` be split into smaller, more focused modules?**
  _Cohesion score 0.07982583454281568 - nodes in this community are weakly interconnected._
- **Why does `typeorm` connect `typeorm` to `devices.dto.ts`, `package.json`, `trials.controller.ts`, `dependencies`, `evaluations.service.ts`, `treatments.service.ts`, `treatment-options.service.ts`, `users.service.ts`, `auth.service.ts`, `trials.service.ts`, `users/entities/index.ts`, `AddTrials1794021872972`, `SeedTrialAndDeviceData1794021872973`, `SeedTreatmentOptions1751181394026`, `test.service.ts`, `CreateUnaccentExtension1752379896329`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `Treatment`, `EvaluationCriteria`, `simulation-runner.ts`, `AddDevices1794006813002`, `SeedAllModules1794108000000`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `devices.dto.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13940256045519203 - nodes in this community are weakly interconnected._
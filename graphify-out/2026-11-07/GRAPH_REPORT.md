# Graph Report - termo-lab-api  (2026-11-06)

## Corpus Check
- 188 files · ~77,881 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .ino 1)

## Summary
- 1575 nodes · 3606 edges · 83 communities (68 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 126 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9d39821a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- auth.service.ts
- TreatmentOptionService
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
- users.service.ts
- treatments.service.ts
- additionalProperties
- ThermalTreatmentInput
- devDependencies
- app.module.ts
- evaluations.controller.ts
- evaluations.service.ts
- CurrentUser
- typeorm
- compilerOptions
- README.md
- @nestjs/swagger
- treatment-options.service.ts
- thermal-analysis.service.ts
- control.ts
- EvaluationsService
- main.ts
- User
- CreateExternalTreatmentDto
- CreateEvaluationDto
- ThermalCalculationsController
- devices.service.ts
- CreateEvaluationCriteriaDto
- 4. Fórmulas de Flujos y Caudales
- device.entity.ts
- SerialConnection
- DaysOfWeek
- CreateTemplateCriteriaDto
- test.service.ts
- .createEvaluation
- 5. Fórmulas de Áreas y Volúmenes
- jest
- ChannelType
- bcrypt
- AddTrials1794021872972
- SeedTrialAndDeviceData1794021872973
- Fórmulas Implementadas en el Sistema Termo-Lab
- 7. Fórmulas de Decantación
- generate-swagger.ts
- 10. Fórmulas de Evaluación
- 9. Fórmulas de Boquillas
- nest-cli.json
- SeedTreatmentOptions1751181394026
- EvaluationTemplateCriteria
- TreatmentOption
- 1. Fórmulas de Propiedades del Crudo
- 3. Fórmulas de Propiedades del Gas
- openapitools.json
- 11. Fórmulas Adicionales
- 2. Fórmulas de Propiedades del Agua
- 6. Fórmulas de Tiempos de Retención
- 8. Fórmulas de Calor
- tsconfig.build.json
- index.d.ts
- CrudRepository
- CreateUnaccentExtension1752379896329
- AddThermalCalculationFields1759797734044
- AddThermalCalculationsToEvaluations1763061460756
- AddTemplateIdToEvaluations1763061460757
- id.create.ts
- @nestjs/common
- Treatment
- start-backend-debug.sh
- src_auth_decorators_index_public
- Evaluation
- AddDevices1794006813002
- CreateTreatmentOptionDto
- QueryEvaluationDto

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 65 edges
2. `ThermalCalculatorService` - 62 edges
3. `User` - 56 edges
4. `DevicesService` - 54 edges
5. `@nestjs/common` - 47 edges
6. `TreatmentsService` - 36 edges
7. `typeorm` - 35 edges
8. `Evaluation` - 32 edges
9. `IdEntity` - 31 edges
10. `DevicesController` - 30 edges

## Surprising Connections (you probably didn't know these)
- `DesignVar` --references--> `ThermalTreatmentInput`  [EXTRACTED]
  src/repositories/evaluations/services/thermal-analysis.service.ts → src/repositories/evaluations/services/thermal-calculator.service.ts
- `QueryEvaluationDto` --inherits--> `QueryBaseDto`  [EXTRACTED]
  src/repositories/evaluations/dto/query-evaluation.dto.ts → src/common/pagination/dto/query-base.dto.ts
- `TestService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/test/test.service.ts → src/common/use-case/crud-repository.ts
- `TreatmentOptionService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/treatment-options/treatment-options.service.ts → src/common/use-case/crud-repository.ts
- `TreatmentsService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/treatments/treatments.service.ts → src/common/use-case/crud-repository.ts

## Import Cycles
- None detected.

## Communities (83 total, 15 thin omitted)

### Community 0 - "auth.service.ts"
Cohesion: 0.05
Nodes (47): ApiCookieAuth, ref_express, @nestjs/config, @nestjs/jwt, @nestjs/passport, Req, AuthController, ApiBody (+39 more)

### Community 1 - "TreatmentOptionService"
Cohesion: 0.13
Nodes (18): Put, TreatmentOptionResponseDto, ApiProperty, TreatmentOptionController, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags (+10 more)

### Community 2 - "UserResponseDto"
Cohesion: 0.05
Nodes (41): EvaluationCriteriaResponseDto, ApiProperty, ApiPropertyOptional, EvaluationResponseDto, ApiProperty, ApiPropertyOptional, ExternalTreatmentResponseDto, ApiProperty (+33 more)

### Community 4 - "devices.dto.ts"
Cohesion: 0.20
Nodes (23): ArrayMaxSize, IsInt, Matches, CreateChannelDto, CreateDeviceDto, CreatePidDto, CreateRuleDto, RawCommandDto (+15 more)

### Community 5 - "DevicesController"
Cohesion: 0.14
Nodes (15): DevicesController, Id(), ApiOkResponse, ApiOperation, ApiQuery, ApiTags, Body, Controller (+7 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (39): author, description, license, name, private, version, eslint, eslint-config-prettier (+31 more)

### Community 7 - "trials.controller.ts"
Cohesion: 0.06
Nodes (51): calibrate(), CalibrationResult, interpolate(), pilotMass(), simulateTwin(), ThermalTwinService, TimeSeries, Injectable (+43 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, bcrypt, class-transformer, class-validator, cookie-parser, csurf, express-session, helmet (+24 more)

### Community 9 - "TreatmentsService"
Cohesion: 0.06
Nodes (37): CalculateTreatmentDto, ApiProperty, IsNotEmpty, IsNumber, Max, Min, CreateTreatmentDto, ApiProperty (+29 more)

### Community 10 - "DevicesService"
Cohesion: 0.14
Nodes (3): isOutput(), DevicesService, Injectable

### Community 11 - "QueryBaseDto"
Cohesion: 0.10
Nodes (22): PaginationDataDto, PaginationDto, ApiProperty, QueryBaseDto, ApiPropertyOptional, IsIn, IsNumber, IsOptional (+14 more)

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 13 - "users.service.ts"
Cohesion: 0.10
Nodes (20): ref_crypto, AdminGuard, Injectable, src_auth_guards_index_adminguard, src_common_use_case_index_crudrepository, DevicesModule, Module, EvaluationsModule (+12 more)

### Community 14 - "treatments.service.ts"
Cohesion: 0.15
Nodes (12): src_repositories_treatment_options_entities_index_treatmentoption, src_repositories_treatments_dto_index_calculatetreatmentdto, src_repositories_treatments_dto_index_querytreatmentdto, src_repositories_treatments_dto_index_treatmentcalculationsdto, TreatmentCalculationsDto, ApiProperty, UpdateTreatmentDto, src_repositories_treatments_entities_index_treatment (+4 more)

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - "ThermalTreatmentInput"
Cohesion: 0.21
Nodes (13): ReportsController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body, Controller, Post (+5 more)

### Community 17 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier, jest, @nestjs/cli, @nestjs/schematics, @nestjs/testing (+15 more)

### Community 18 - "app.module.ts"
Cohesion: 0.13
Nodes (12): @nestjs/serve-static, AppController, Body, Controller, Get, Post, AppService, Injectable (+4 more)

### Community 19 - "evaluations.controller.ts"
Cohesion: 0.12
Nodes (12): class-transformer, class-validator, src_auth_decorators_index_currentuser, src_auth_guards_index_jwtauthguard, EvaluationTemplateResponseDto, ApiProperty, src_repositories_evaluations_dto_index_createexternaltreatmentdto, src_repositories_evaluations_dto_index_queryevaluationdto (+4 more)

### Community 20 - "evaluations.service.ts"
Cohesion: 0.18
Nodes (5): @nestjs/testing, src_common_pagination_dto_index_paginationdto, src_repositories_evaluations_dto_index_createevaluationcriteriadto, src_repositories_evaluations_dto_index_createevaluationdto, src_repositories_evaluations_dto_index_updateevaluationdto

### Community 21 - "CurrentUser"
Cohesion: 0.18
Nodes (15): CurrentUser, EvaluationsController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller (+7 more)

### Community 22 - "typeorm"
Cohesion: 0.22
Nodes (10): ref_dotenv, typeorm, IdEntity, ApiProperty, Column, CreateDateColumn, PrimaryGeneratedColumn, src_repositories_base_index_identity (+2 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+11 more)

### Community 24 - "README.md"
Cohesion: 0.05
Nodes (37): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+29 more)

### Community 25 - "@nestjs/swagger"
Cohesion: 0.12
Nodes (13): IsDate, @nestjs/swagger, BaseResponseDto, ApiProperty, IsBoolean, IsNotEmpty, IsNumber, IsOptional (+5 more)

### Community 26 - "treatment-options.service.ts"
Cohesion: 0.24
Nodes (8): @nestjs/typeorm, src_common_pagination_dto_index_querybasedto, src_repositories_treatment_options_dto_index_createtreatmentoptiondto, src_repositories_treatment_options_dto_index_treatmentoptionlistdto, src_repositories_treatment_options_dto_index_treatmentoptionresponsedto, src_repositories_treatment_options_dto_index_updatetreatmentoptiondto, UpdateTreatmentOptionDto, ALLOWED_SORT

### Community 27 - "thermal-analysis.service.ts"
Cohesion: 0.11
Nodes (22): allPass(), bisect(), checkCriteria(), CriterionResult, DESIGN_VARS, DesignVar, DiagnoseResult, Distribution (+14 more)

### Community 28 - "control.ts"
Cohesion: 0.11
Nodes (21): serialport, @serialport/parser-readline, calibrate(), ChannelLike, COMMAND_REGEX, evalRule(), OUTPUT_TYPES, outputRange() (+13 more)

### Community 29 - "EvaluationsService"
Cohesion: 0.24
Nodes (5): EvaluationsService, ApiOperation, ApiResponse, ApiTags, Injectable

### Community 30 - "main.ts"
Cohesion: 0.15
Nodes (9): Catch, cookie-parser, csurf, helmet, JwtAuthGuard, Injectable, HttpExceptionFilter, SENSITIVE_KEYS (+1 more)

### Community 31 - "User"
Cohesion: 0.17
Nodes (8): BeforeInsert, InjectRepository, SeedAdminAndOperatorUsers1751178224375, ApiProperty, ApiPropertyOptional, Column, Entity, User

### Community 32 - "CreateExternalTreatmentDto"
Cohesion: 0.20
Nodes (10): CreateExternalTreatmentDto, ApiProperty, ApiPropertyOptional, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 33 - "CreateEvaluationDto"
Cohesion: 0.15
Nodes (13): ArrayMinSize, IsArray, CreateEvaluationDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsDateString, IsEnum (+5 more)

### Community 34 - "ThermalCalculationsController"
Cohesion: 0.26
Nodes (11): ThermalCalculationsController, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags, Body (+3 more)

### Community 35 - "devices.service.ts"
Cohesion: 0.18
Nodes (16): rxjs, PidState, UpdateChannelDto, UpdateDeviceDto, UpdatePidDto, UpdateRuleDto, LiveEvent, PidRuntime (+8 more)

### Community 36 - "CreateEvaluationCriteriaDto"
Cohesion: 0.17
Nodes (12): CreateEvaluationCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional (+4 more)

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "device.entity.ts"
Cohesion: 0.26
Nodes (18): InjectRepository, ChannelReading, Device, DeviceChannel, DeviceCommandLog, DeviceRule, double, PidLoop (+10 more)

### Community 40 - "DaysOfWeek"
Cohesion: 0.20
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 41 - "CreateTemplateCriteriaDto"
Cohesion: 0.20
Nodes (10): CreateTemplateCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 42 - "test.service.ts"
Cohesion: 0.05
Nodes (45): BaseEntityDto, ApiPropertyOptional, IsBoolean, IsNumber, IsOptional, CreateTestDto, ApiProperty, IsNotEmpty (+37 more)

### Community 43 - ".createEvaluation"
Cohesion: 0.22
Nodes (6): CalculationCriteria, ComparisonOperator, EvaluationCalculationResult, EvaluationCalculatorService, ApiProperty, Injectable

### Community 44 - "5. Fórmulas de Áreas y Volúmenes"
Cohesion: 0.22
Nodes (9): 5.1 Área Total del Recipiente (Ecuación 1.10), 5.2 Área desde el Fondo al Nivel Bajo Bajo de Agua (Ecuación 1.9), 5.3 Área Ocupada por el Agua (Ecuación 1.17 / Ec. 26), 5.4 Área Ocupada por el Crudo (Ecuación 1.4 / Ec. 13), 5.5 Área Disponible para el Gas (Ecuación 1.11), 5.6 Área Requerida para el Gas (Ecuación 1.15 / Ec. 25), 5.7 Volumen de Retención del Crudo (Ecuación 1.5), 5.8 Volumen de Retención del Agua (Ecuación 1.12) (+1 more)

### Community 45 - "jest"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 46 - "ChannelType"
Cohesion: 0.22
Nodes (9): ChannelType, ANALOG_IN, DIGITAL_IN, DIGITAL_OUT, DS18B20, MAX31865, MAX6675, PWM (+1 more)

### Community 50 - "Fórmulas Implementadas en el Sistema Termo-Lab"
Cohesion: 0.33
Nodes (6): Backend (termo-lab-api), Fórmulas Implementadas en el Sistema Termo-Lab, 📝 Notas Importantes, 🔍 Referencias, 📊 Resumen de Archivos, 📋 Índice

### Community 51 - "7. Fórmulas de Decantación"
Cohesion: 0.29
Nodes (7): 7.1 Velocidad de Decantación de la Fase Pesada (Ecuación 1.22), 7.2 Tiempo de Decantación de la Fase Pesada (Ecuación 1.23), 7.3 Tiempo de Decantación de la Fase Liviana (Ecuación 1.24 / Ec. 33), 7.4 Porcentaje de Deshidratación del Equipo (Ecuación 1.19 / Ec. 28), 7.5 Cantidad de Agua Saliendo con el Crudo (Ecuación 1.18 / Ec. 27), 7.6 Corte de Agua del Crudo Saliendo (Ecuación 1.13 / Ec. 23), 7. Fórmulas de Decantación

### Community 52 - "generate-swagger.ts"
Cohesion: 0.22
Nodes (6): ref_fs, @nestjs/core, ref_path, supertest, AppModule, Module

### Community 53 - "10. Fórmulas de Evaluación"
Cohesion: 0.33
Nodes (6): 10.1 Margen de Cumplimiento, 10.2 Promedio de Cumplimiento, 10.3 Puntaje Ponderado, 10.4 Eficiencia de Separación, 10.5 Eficiencia de Separación (Alternativa), 10. Fórmulas de Evaluación

### Community 54 - "9. Fórmulas de Boquillas"
Cohesion: 0.33
Nodes (6): 9.1 Velocidad en Boquilla de Entrada, 9.2 Diámetro de Boquilla, 9.3 Velocidad en Boquilla de Salida de Crudo, 9.4 Velocidad en Boquilla de Salida de Agua, 9.5 Velocidad en Boquilla de Salida de Gas, 9. Fórmulas de Boquillas

### Community 55 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 57 - "EvaluationTemplateCriteria"
Cohesion: 0.17
Nodes (9): CreateEvaluationTemplates1751337696278, EvaluationTemplateCriteria, ApiProperty, ApiPropertyOptional, Column, Entity, ManyToOne, src_repositories_evaluations_entities_index_evaluationtemplate (+1 more)

### Community 58 - "TreatmentOption"
Cohesion: 0.20
Nodes (7): TreatmentOption, ApiProperty, ApiPropertyOptional, Column, Entity, InjectRepository, InjectRepository

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

### Community 66 - "tsconfig.build.json"
Cohesion: 0.50
Nodes (3): ./tsconfig.json, exclude, extends

### Community 67 - "index.d.ts"
Cohesion: 0.50
Nodes (3): ref_users_entities_user_entity, Express, Request

### Community 73 - "id.create.ts"
Cohesion: 0.40
Nodes (4): IdCreateEntity, ApiProperty, IsNotEmpty, IsNumber

### Community 74 - "@nestjs/common"
Cohesion: 0.24
Nodes (7): @nestjs/common, src_repositories_evaluations_services_index_evaluationcalculatorservice, src_repositories_evaluations_services_index_evaluationsservice, src_repositories_evaluations_services_index_reportgeneratorservice, src_repositories_evaluations_services_index_thermalanalysisservice, src_repositories_evaluations_services_index_thermalcalculatorservice, EvaluationReportData

### Community 76 - "Treatment"
Cohesion: 0.10
Nodes (15): CreateSampleTreatments1751337651500, src_repositories_evaluations_entities_index_evaluation, src_repositories_evaluations_entities_index_evaluationcriteria, src_repositories_evaluations_entities_index_externaltreatment, Treatment, ApiProperty, Column, Entity (+7 more)

### Community 81 - "Evaluation"
Cohesion: 0.07
Nodes (27): CreateSampleEvaluations1751337651990, EvaluationCriteria, ApiProperty, ApiPropertyOptional, Column, Entity, ManyToOne, Evaluation (+19 more)

### Community 90 - "CreateTreatmentOptionDto"
Cohesion: 0.22
Nodes (9): CreateTreatmentOptionDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max (+1 more)

### Community 92 - "QueryEvaluationDto"
Cohesion: 0.25
Nodes (8): QueryEvaluationDto, ApiPropertyOptional, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Type

## Knowledge Gaps
- **305 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+300 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 673 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `auth.service.ts`, `devices.service.ts`, `package.json`, `trials.controller.ts`, `test.service.ts`, `.createEvaluation`, `Treatment`, `users.service.ts`, `treatments.service.ts`, `app.module.ts`, `evaluations.controller.ts`, `evaluations.service.ts`, `CurrentUser`, `generate-swagger.ts`, `treatment-options.service.ts`, `thermal-analysis.service.ts`, `control.ts`, `main.ts`?**
  _High betweenness centrality (0.201) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `auth.service.ts`, `devices.dto.ts`, `package.json`, `trials.controller.ts`, `QueryBaseDto`, `users.service.ts`, `treatments.service.ts`, `evaluations.controller.ts`, `evaluations.service.ts`, `typeorm`, `treatment-options.service.ts`, `thermal-analysis.service.ts`, `main.ts`, `devices.service.ts`, `device.entity.ts`, `test.service.ts`, `.createEvaluation`, `generate-swagger.ts`, `id.create.ts`, `@nestjs/common`, `Treatment`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `typeorm` connect `typeorm` to `auth.service.ts`, `package.json`, `trials.controller.ts`, `users.service.ts`, `treatments.service.ts`, `evaluations.service.ts`, `treatment-options.service.ts`, `devices.service.ts`, `device.entity.ts`, `test.service.ts`, `bcrypt`, `AddTrials1794021872972`, `SeedTrialAndDeviceData1794021872973`, `SeedTreatmentOptions1751181394026`, `EvaluationTemplateCriteria`, `CreateUnaccentExtension1752379896329`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `Treatment`, `AddDevices1794006813002`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _305 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `auth.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.052160493827160495 - nodes in this community are weakly interconnected._
- **Should `TreatmentOptionService` be split into smaller, more focused modules?**
  _Cohesion score 0.12773109243697478 - nodes in this community are weakly interconnected._
- **Should `UserResponseDto` be split into smaller, more focused modules?**
  _Cohesion score 0.05493863237872589 - nodes in this community are weakly interconnected._
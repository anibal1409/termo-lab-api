# Graph Report - termo-lab-api  (2026-11-18)

## Corpus Check
- 212 files · ~83,251 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .ino 1)

## Summary
- 1848 nodes · 4223 edges · 106 communities (91 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 141 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33d23ec6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- auth.service.ts
- treatment-options.service.ts
- UsersController
- ThermalCalculatorService
- devices.service.ts
- DevicesController
- package.json
- trials.controller.ts
- dependencies
- test.service.ts
- DevicesService
- evaluations.service.ts
- scripts
- EvaluationTemplateCriteria
- treatments.service.ts
- additionalProperties
- ThermalTreatmentInput
- devDependencies
- app.module.ts
- evaluations.module.ts
- @nestjs/common
- User
- typeorm
- compilerOptions
- README.md
- BaseResponseDto
- create-test.dto.ts
- thermal-analysis.service.ts
- control.ts
- Evaluation
- main.ts
- CreateTreatmentDto
- CreateExternalTreatmentDto
- CreateEvaluationDto
- ThermalCalculationsController
- TreatmentsService
- AuthController
- 4. Fórmulas de Flujos y Caudales
- device.entity.ts
- SerialConnection
- DaysOfWeek
- CreateTemplateCriteriaDto
- TestController
- .createEvaluation
- 5. Fórmulas de Áreas y Volúmenes
- jest
- RunnerService
- 1751178224375-SeedAdminAndOperatorUsers.ts
- AddTrials1794021872972
- SeedTrialAndDeviceData1794021872973
- Fórmulas Implementadas en el Sistema Termo-Lab
- 7. Fórmulas de Decantación
- generate-swagger.ts
- 10. Fórmulas de Evaluación
- 9. Fórmulas de Boquillas
- nest-cli.json
- SeedTreatmentOptions1751181394026
- AuthService
- evaluation-response.dto.ts
- 1. Fórmulas de Propiedades del Crudo
- 3. Fórmulas de Propiedades del Gas
- openapitools.json
- 11. Fórmulas Adicionales
- 2. Fórmulas de Propiedades del Agua
- 6. Fórmulas de Tiempos de Retención
- 8. Fórmulas de Calor
- tsconfig.build.json
- index.d.ts
- components.ts
- CreateUnaccentExtension1752379896329
- AddThermalCalculationFields1759797734044
- AddThermalCalculationsToEvaluations1763061460756
- AddTemplateIdToEvaluations1763061460757
- IdCreateEntity
- ProfileController
- user-response.dto.ts
- Treatment
- start-backend-debug.sh
- simulation.controller.ts
- auth/dto/index.ts
- use-case.ts
- CreateUserDto
- simulation-runner.ts
- AddDevices1794006813002
- UserResponseDto
- @nestjs/swagger
- .changePassword
- RegisterDto
- LoginDto
- repositories.module.ts
- SeedAllModules1794108000000
- EvaluationType
- LogoutResponseDto
- equipment.controller.ts
- SimulationController
- eos.ts
- Public
- CreateEvaluationCriteriaDto
- simulation.service.ts
- PipelineFeedDto
- heat-exchanger.ts
- EnrollFaceDto
- separator.ts
- chromatography.ts
- storage-tank.ts

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 73 edges
2. `ThermalCalculatorService` - 62 edges
3. `User` - 60 edges
4. `DevicesService` - 54 edges
5. `@nestjs/common` - 53 edges
6. `typeorm` - 37 edges
7. `TreatmentsService` - 36 edges
8. `Evaluation` - 32 edges
9. `CurrentUser` - 31 edges
10. `IdEntity` - 31 edges

## Surprising Connections (you probably didn't know these)
- `DesignVar` --references--> `ThermalTreatmentInput`  [EXTRACTED]
  src/repositories/evaluations/services/thermal-analysis.service.ts → src/repositories/evaluations/services/thermal-calculator.service.ts
- `TestService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/test/test.service.ts → src/common/use-case/crud-repository.ts
- `TreatmentsService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/treatments/treatments.service.ts → src/common/use-case/crud-repository.ts
- `UsersService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/users/users.service.ts → src/common/use-case/crud-repository.ts
- `CreateTestDto` --inherits--> `BaseEntityDto`  [EXTRACTED]
  src/repositories/test/dto/create-test.dto.ts → src/repositories/base/base-entity.dto.ts

## Import Cycles
- None detected.

## Communities (106 total, 15 thin omitted)

### Community 0 - "auth.service.ts"
Cohesion: 0.13
Nodes (17): ref_express, @nestjs/config, @nestjs/jwt, @nestjs/passport, src_auth_dto_index_enrollfacedto, src_auth_dto_index_facelogindto, src_auth_dto_index_logindto, src_auth_dto_index_loginresponsedto (+9 more)

### Community 1 - "treatment-options.service.ts"
Cohesion: 0.06
Nodes (42): Put, CrudRepository, CreateTreatmentOptionDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional (+34 more)

### Community 2 - "UsersController"
Cohesion: 0.17
Nodes (14): ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, Body, Controller (+6 more)

### Community 4 - "devices.service.ts"
Cohesion: 0.11
Nodes (39): IsInt, Matches, rxjs, src_auth_guards_index_adminguard, PidState, CreateChannelDto, CreateDeviceDto, CreatePidDto (+31 more)

### Community 5 - "DevicesController"
Cohesion: 0.17
Nodes (15): DevicesController, Id(), ApiOkResponse, ApiOperation, ApiQuery, ApiTags, Body, Controller (+7 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (39): author, description, license, name, private, version, eslint, eslint-config-prettier (+31 more)

### Community 7 - "trials.controller.ts"
Cohesion: 0.06
Nodes (49): calibrate(), CalibrationResult, interpolate(), pilotMass(), simulateTwin(), ThermalTwinService, TimeSeries, Injectable (+41 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, bcrypt, class-transformer, class-validator, cookie-parser, csurf, express-session, helmet (+24 more)

### Community 9 - "test.service.ts"
Cohesion: 0.13
Nodes (13): @nestjs/typeorm, src_common_use_case_index_crudrepository, CreateTestDto, ApiProperty, IsNotEmpty, IsString, MaxLength, src_repositories_test_dto_index_createtestdto (+5 more)

### Community 10 - "DevicesService"
Cohesion: 0.10
Nodes (6): evalRule(), isOutput(), writeCommand(), DevicesService, pinNumber(), Injectable

### Community 11 - "evaluations.service.ts"
Cohesion: 0.08
Nodes (29): PaginationDto, QueryBaseDto, ApiPropertyOptional, IsIn, IsNumber, IsOptional, IsString, Type (+21 more)

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 13 - "EvaluationTemplateCriteria"
Cohesion: 0.33
Nodes (6): EvaluationTemplateCriteria, ApiProperty, ApiPropertyOptional, Column, Entity, ManyToOne

### Community 14 - "treatments.service.ts"
Cohesion: 0.10
Nodes (16): PaginationDataDto, ApiProperty, CreateSampleTreatments1751337651500, src_repositories_treatment_options_entities_index_treatmentoption, src_repositories_treatments_dto_index_calculatetreatmentdto, src_repositories_treatments_dto_index_querytreatmentdto, src_repositories_treatments_dto_index_treatmentcalculationsdto, TreatmentCalculationsDto (+8 more)

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - "ThermalTreatmentInput"
Cohesion: 0.17
Nodes (14): ReportsController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body, Controller, Post (+6 more)

### Community 17 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier, jest, @nestjs/cli, @nestjs/schematics, @nestjs/testing (+15 more)

### Community 18 - "app.module.ts"
Cohesion: 0.14
Nodes (10): @nestjs/serve-static, AppController, Body, Controller, Get, Post, AppService, Injectable (+2 more)

### Community 19 - "evaluations.module.ts"
Cohesion: 0.07
Nodes (30): CreateSampleEvaluations1751337651990, CreateEvaluationTemplates1751337696278, EvaluationCriteria, ApiProperty, ApiPropertyOptional, Column, Entity, ManyToOne (+22 more)

### Community 20 - "@nestjs/common"
Cohesion: 0.16
Nodes (15): @nestjs/common, src_auth_decorators_index_currentuser, IS_PUBLIC_KEY, AdminGuard, Injectable, src_common_pagination_dto_index_paginationdto, src_common_pagination_dto_index_querybasedto, src_repositories_users_dto_index_changepassworddto (+7 more)

### Community 21 - "User"
Cohesion: 0.15
Nodes (21): BeforeInsert, CurrentUser, EvaluationsController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body (+13 more)

### Community 22 - "typeorm"
Cohesion: 0.21
Nodes (11): ref_crypto, ref_dotenv, typeorm, IdEntity, ApiProperty, Column, CreateDateColumn, PrimaryGeneratedColumn (+3 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+11 more)

### Community 24 - "README.md"
Cohesion: 0.05
Nodes (37): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+29 more)

### Community 25 - "BaseResponseDto"
Cohesion: 0.15
Nodes (11): IsDate, BaseResponseDto, ApiProperty, IsBoolean, IsNotEmpty, IsNumber, IsOptional, Type (+3 more)

### Community 26 - "create-test.dto.ts"
Cohesion: 0.25
Nodes (6): BaseEntityDto, ApiPropertyOptional, IsBoolean, IsNumber, IsOptional, src_repositories_base_index_baseentitydto

### Community 27 - "thermal-analysis.service.ts"
Cohesion: 0.11
Nodes (22): allPass(), bisect(), checkCriteria(), CriterionResult, DESIGN_VARS, DesignVar, DiagnoseResult, Distribution (+14 more)

### Community 28 - "control.ts"
Cohesion: 0.09
Nodes (28): serialport, @serialport/parser-readline, calibrate(), ChannelLike, ChannelType, ANALOG_IN, DIGITAL_IN, DIGITAL_OUT (+20 more)

### Community 29 - "Evaluation"
Cohesion: 0.15
Nodes (13): Evaluation, ApiProperty, ApiPropertyOptional, Column, Entity, JoinColumn, ManyToOne, OneToMany (+5 more)

### Community 30 - "main.ts"
Cohesion: 0.15
Nodes (9): Catch, cookie-parser, csurf, helmet, JwtAuthGuard, Injectable, HttpExceptionFilter, SENSITIVE_KEYS (+1 more)

### Community 31 - "CreateTreatmentDto"
Cohesion: 0.22
Nodes (9): CreateTreatmentDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max (+1 more)

### Community 32 - "CreateExternalTreatmentDto"
Cohesion: 0.20
Nodes (10): CreateExternalTreatmentDto, ApiProperty, ApiPropertyOptional, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 33 - "CreateEvaluationDto"
Cohesion: 0.15
Nodes (13): CreateEvaluationDto, ApiProperty, ApiPropertyOptional, ArrayMinSize, IsArray, IsBoolean, IsDateString, IsEnum (+5 more)

### Community 34 - "ThermalCalculationsController"
Cohesion: 0.26
Nodes (11): ThermalCalculationsController, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags, Body (+3 more)

### Community 35 - "TreatmentsService"
Cohesion: 0.08
Nodes (28): CalculateTreatmentDto, ApiProperty, IsNotEmpty, IsNumber, Max, Min, TreatmentResponseDto, ApiProperty (+20 more)

### Community 36 - "AuthController"
Cohesion: 0.17
Nodes (14): ApiCookieAuth, Req, AuthController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body (+6 more)

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "device.entity.ts"
Cohesion: 0.24
Nodes (19): InjectRepository, ChannelReading, Device, DEVICE_ENTITIES, DeviceChannel, DeviceCommandLog, DeviceRule, double (+11 more)

### Community 40 - "DaysOfWeek"
Cohesion: 0.20
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 41 - "CreateTemplateCriteriaDto"
Cohesion: 0.20
Nodes (10): CreateTemplateCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 42 - "TestController"
Cohesion: 0.07
Nodes (29): TestResponseDto, ApiProperty, IsNotEmpty, IsString, UpdateTestDto, Test, ApiProperty, Column (+21 more)

### Community 43 - ".createEvaluation"
Cohesion: 0.22
Nodes (6): CalculationCriteria, ComparisonOperator, EvaluationCalculationResult, EvaluationCalculatorService, ApiProperty, Injectable

### Community 44 - "5. Fórmulas de Áreas y Volúmenes"
Cohesion: 0.22
Nodes (9): 5.1 Área Total del Recipiente (Ecuación 1.10), 5.2 Área desde el Fondo al Nivel Bajo Bajo de Agua (Ecuación 1.9), 5.3 Área Ocupada por el Agua (Ecuación 1.17 / Ec. 26), 5.4 Área Ocupada por el Crudo (Ecuación 1.4 / Ec. 13), 5.5 Área Disponible para el Gas (Ecuación 1.11), 5.6 Área Requerida para el Gas (Ecuación 1.15 / Ec. 25), 5.7 Volumen de Retención del Crudo (Ecuación 1.5), 5.8 Volumen de Retención del Agua (Ecuación 1.12) (+1 more)

### Community 45 - "jest"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 46 - "RunnerService"
Cohesion: 0.33
Nodes (3): RunnerService, Injectable, InjectRepository

### Community 47 - "1751178224375-SeedAdminAndOperatorUsers.ts"
Cohesion: 0.20
Nodes (4): bcrypt, SeedAdminAndOperatorUsers1751178224375, UpdateUserPasswords1759794383734, src_repositories_users_entities_index_userrole

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

### Community 57 - "AuthService"
Cohesion: 0.14
Nodes (4): @nestjs/testing, AuthService, Injectable, InjectRepository

### Community 58 - "evaluation-response.dto.ts"
Cohesion: 0.20
Nodes (9): EvaluationCriteriaResponseDto, ApiProperty, ApiPropertyOptional, EvaluationResponseDto, ApiProperty, ApiPropertyOptional, ExternalTreatmentResponseDto, ApiProperty (+1 more)

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

### Community 68 - "components.ts"
Cohesion: 0.04
Nodes (44): BIP, C1, C2, C3, C36P, CO2, COMP_INDEX, H2O (+36 more)

### Community 73 - "IdCreateEntity"
Cohesion: 0.50
Nodes (4): IdCreateEntity, ApiProperty, IsNotEmpty, IsNumber

### Community 74 - "ProfileController"
Cohesion: 0.33
Nodes (5): ProfileController, ApiBearerAuth, ApiTags, Controller, UseGuards

### Community 75 - "user-response.dto.ts"
Cohesion: 0.38
Nodes (3): UserRole, ADMIN, OPERATOR

### Community 76 - "Treatment"
Cohesion: 0.20
Nodes (7): Treatment, ApiProperty, Column, Entity, JoinColumn, ManyToOne, InjectRepository

### Community 79 - "simulation.controller.ts"
Cohesion: 0.35
Nodes (11): src_auth_decorators_index_public, ChromatographyInputDto, FlashInputDto, FluidPropertiesInputDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber (+3 more)

### Community 80 - "auth/dto/index.ts"
Cohesion: 0.35
Nodes (7): AuthResponseDto, ApiProperty, LoginResponseDto, ApiProperty, UserDataDto, RegisterResponseDto, ApiProperty

### Community 82 - "CreateUserDto"
Cohesion: 0.15
Nodes (12): CreateUserDto, ApiProperty, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength (+4 more)

### Community 83 - "simulation-runner.ts"
Cohesion: 0.24
Nodes (13): EquipmentType, mergeStreamIntoConfig(), pick(), PipelineInput, PipelineResult, PipelineStep, runEquipment(), runPipeline() (+5 more)

### Community 85 - "UserResponseDto"
Cohesion: 0.21
Nodes (6): ApiProperty, ApiPropertyOptional, UserResponseDto, Injectable, InjectRepository, UsersService

### Community 86 - "@nestjs/swagger"
Cohesion: 0.16
Nodes (8): class-transformer, class-validator, @nestjs/swagger, EvaluationTemplateResponseDto, ApiProperty, src_repositories_evaluations_dto_index_createexternaltreatmentdto, src_repositories_evaluations_dto_index_queryevaluationdto, UpdateEvaluationDto

### Community 87 - ".changePassword"
Cohesion: 0.13
Nodes (17): ApiUnauthorizedResponse, ChangePasswordDto, ApiProperty, ApiPropertyOptional, IsDateString, IsNotEmpty, IsOptional, IsString (+9 more)

### Community 88 - "RegisterDto"
Cohesion: 0.33
Nodes (5): RegisterDto, IsEmail, IsNotEmpty, IsString, MinLength

### Community 89 - "LoginDto"
Cohesion: 0.40
Nodes (4): LoginDto, IsEmail, IsNotEmpty, IsString

### Community 90 - "repositories.module.ts"
Cohesion: 0.13
Nodes (14): DevicesModule, Module, EvaluationsModule, Module, RepositoriesModule, Module, SimulationModule, Module (+6 more)

### Community 92 - "EvaluationType"
Cohesion: 0.67
Nodes (3): EvaluationType, EXTERNAL, INTERNAL

### Community 94 - "equipment.controller.ts"
Cohesion: 0.34
Nodes (14): HeatExchangerFluidDto, HeatExchangerInputDto, SeparatorInputDto, StorageTankInputDto, ThermalTreaterInputDto, ApiProperty, ApiPropertyOptional, IsNumber (+6 more)

### Community 95 - "SimulationController"
Cohesion: 0.28
Nodes (9): SimulationController, ApiBody, ApiOkResponse, ApiOperation, ApiTags, Body, Controller, Get (+1 more)

### Community 96 - "eos.ts"
Cohesion: 0.25
Nodes (12): getKij(), calcPhase(), EOS_CONST, EosParams, lnPhiMix(), mixParams(), PhaseResult, pureParams() (+4 more)

### Community 97 - "Public"
Cohesion: 0.38
Nodes (9): Public(), EquipmentController, ApiBody, ApiOkResponse, ApiOperation, ApiTags, Body, Controller (+1 more)

### Community 98 - "CreateEvaluationCriteriaDto"
Cohesion: 0.17
Nodes (12): CreateEvaluationCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional (+4 more)

### Community 99 - "simulation.service.ts"
Cohesion: 0.15
Nodes (15): SimulationService, Injectable, getComponentsForChromatography(), PureComponent, EosType, FlashResult, src_repositories_simulation_thermo_index_calcphase, src_repositories_simulation_thermo_index_chromatographyresult (+7 more)

### Community 100 - "PipelineFeedDto"
Cohesion: 0.18
Nodes (14): IsObject, PipelineFeedDto, PipelineStepDto, RunPipelineDto, ApiProperty, ApiPropertyOptional, IsArray, IsNumber (+6 more)

### Community 103 - "heat-exchanger.ts"
Cohesion: 0.32
Nodes (6): calcEffectiveness(), calculateHeatExchanger(), estimateShellDiameter(), FlowArrangement, HeatExchangerInput, HeatExchangerResult

### Community 105 - "EnrollFaceDto"
Cohesion: 0.43
Nodes (7): EnrollFaceDto, FaceLoginDto, ApiProperty, ArrayMaxSize, ArrayMinSize, IsArray, IsNumber

### Community 106 - "separator.ts"
Cohesion: 0.32
Nodes (6): calculateSeparator(), estimateGasDensity(), estimateGOR(), SeparatorInput, SeparatorOrientation, SeparatorResult

### Community 107 - "chromatography.ts"
Cohesion: 0.39
Nodes (6): ChromatographyResult, distributeGasPhase(), estimateGOR(), generateChromatography(), whitsonDistribution(), COMPONENT_DB

### Community 108 - "storage-tank.ts"
Cohesion: 0.21
Nodes (10): calculateStorageTank(), estimateRVP(), r(), StorageTankInput, StorageTankResult, calculateThermalTreater(), estimateFlashGas(), r() (+2 more)

## Knowledge Gaps
- **363 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+358 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 778 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `auth.service.ts`, `treatment-options.service.ts`, `devices.service.ts`, `package.json`, `trials.controller.ts`, `test.service.ts`, `evaluations.service.ts`, `treatments.service.ts`, `ThermalTreatmentInput`, `app.module.ts`, `evaluations.module.ts`, `thermal-analysis.service.ts`, `control.ts`, `main.ts`, `.createEvaluation`, `generate-swagger.ts`, `simulation.controller.ts`, `simulation-runner.ts`, `@nestjs/swagger`, `repositories.module.ts`, `equipment.controller.ts`, `simulation.service.ts`?**
  _High betweenness centrality (0.243) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `auth.service.ts`, `treatment-options.service.ts`, `devices.service.ts`, `package.json`, `trials.controller.ts`, `test.service.ts`, `evaluations.service.ts`, `treatments.service.ts`, `ThermalTreatmentInput`, `@nestjs/common`, `typeorm`, `BaseResponseDto`, `create-test.dto.ts`, `thermal-analysis.service.ts`, `main.ts`, `device.entity.ts`, `.createEvaluation`, `generate-swagger.ts`, `evaluation-response.dto.ts`, `user-response.dto.ts`, `simulation.controller.ts`, `auth/dto/index.ts`, `LogoutResponseDto`, `equipment.controller.ts`, `EnrollFaceDto`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Why does `typeorm` connect `typeorm` to `auth.service.ts`, `treatment-options.service.ts`, `devices.service.ts`, `package.json`, `trials.controller.ts`, `test.service.ts`, `evaluations.service.ts`, `treatments.service.ts`, `evaluations.module.ts`, `@nestjs/common`, `device.entity.ts`, `1751178224375-SeedAdminAndOperatorUsers.ts`, `AddTrials1794021872972`, `SeedTrialAndDeviceData1794021872973`, `SeedTreatmentOptions1751181394026`, `CreateUnaccentExtension1752379896329`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `simulation-runner.ts`, `AddDevices1794006813002`, `SeedAllModules1794108000000`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _363 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `auth.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Should `treatment-options.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.057297297297297295 - nodes in this community are weakly interconnected._
- **Should `ThermalCalculatorService` be split into smaller, more focused modules?**
  _Cohesion score 0.07982583454281568 - nodes in this community are weakly interconnected._
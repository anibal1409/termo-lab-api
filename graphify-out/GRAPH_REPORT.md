# Graph Report - termo-lab-api  (2026-11-07)

## Corpus Check
- 189 files · ~80,593 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .ino 1)

## Summary
- 1580 nodes · 3613 edges · 94 communities (75 shown, 19 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 128 edges (avg confidence: 0.8)
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
- CreateChannelDto
- DevicesController
- package.json
- trials.controller.ts
- dependencies
- TreatmentsService
- DevicesService
- QueryBaseDto
- scripts
- evaluations.module.ts
- treatments.service.ts
- additionalProperties
- ThermalTreatmentInput
- devDependencies
- AppService
- evaluations.service.ts
- users.service.ts
- CurrentUser
- typeorm
- compilerOptions
- README.md
- @nestjs/swagger
- treatment-options.service.ts
- thermal-analysis.service.ts
- devices.service.ts
- EvaluationsService
- main.ts
- User
- CreateExternalTreatmentDto
- CreateEvaluationDto
- ThermalCalculationsController
- TreatmentResponseDto
- .login
- 4. Fórmulas de Flujos y Caudales
- DeviceChannel
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
- app.module.ts
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
- rxjs
- CreateUnaccentExtension1752379896329
- AddThermalCalculationFields1759797734044
- AddThermalCalculationsToEvaluations1763061460756
- AddTemplateIdToEvaluations1763061460757
- id.create.ts
- @nestjs/common
- UserRole
- Treatment
- start-backend-debug.sh
- src_auth_decorators_index_public
- auth/dto/index.ts
- Evaluation
- CreateUserDto
- CreateTreatmentDto
- AddDevices1794006813002
- UsersService
- create-test.dto.ts
- .update
- RegisterDto
- LoginDto
- jwt-auth.guard.ts
- SeedAllModules1794108000000
- QueryEvaluationDto
- LogoutResponseDto

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 65 edges
2. `ThermalCalculatorService` - 62 edges
3. `User` - 56 edges
4. `DevicesService` - 54 edges
5. `@nestjs/common` - 47 edges
6. `typeorm` - 36 edges
7. `TreatmentsService` - 36 edges
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

## Communities (94 total, 19 thin omitted)

### Community 0 - "auth.service.ts"
Cohesion: 0.17
Nodes (13): ref_express, @nestjs/config, @nestjs/jwt, passport-jwt, src_auth_dto_index_logindto, src_auth_dto_index_loginresponsedto, src_auth_dto_index_logoutresponsedto, src_auth_dto_index_registerdto (+5 more)

### Community 1 - "TreatmentOptionService"
Cohesion: 0.07
Nodes (34): Put, CreateTreatmentOptionDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString (+26 more)

### Community 2 - "UserResponseDto"
Cohesion: 0.13
Nodes (16): ApiProperty, ApiPropertyOptional, UserResponseDto, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam (+8 more)

### Community 4 - "CreateChannelDto"
Cohesion: 0.18
Nodes (23): ArrayMaxSize, IsInt, Matches, CreateChannelDto, CreateDeviceDto, CreatePidDto, CreateRuleDto, RawCommandDto (+15 more)

### Community 5 - "DevicesController"
Cohesion: 0.17
Nodes (15): DevicesController, Id(), ApiOkResponse, ApiOperation, ApiQuery, ApiTags, Body, Controller (+7 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (38): author, description, license, name, private, version, eslint, eslint-config-prettier (+30 more)

### Community 7 - "trials.controller.ts"
Cohesion: 0.06
Nodes (49): calibrate(), CalibrationResult, interpolate(), pilotMass(), simulateTwin(), ThermalTwinService, TimeSeries, Injectable (+41 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, bcrypt, class-transformer, class-validator, cookie-parser, csurf, express-session, helmet (+24 more)

### Community 9 - "TreatmentsService"
Cohesion: 0.12
Nodes (8): CalculateTreatmentDto, ApiProperty, IsNotEmpty, IsNumber, Max, Min, TreatmentsService, Injectable

### Community 10 - "DevicesService"
Cohesion: 0.11
Nodes (3): isOutput(), DevicesService, Injectable

### Community 11 - "QueryBaseDto"
Cohesion: 0.10
Nodes (21): PaginationDto, QueryBaseDto, ApiPropertyOptional, IsIn, IsNumber, IsOptional, IsString, Type (+13 more)

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 13 - "evaluations.module.ts"
Cohesion: 0.08
Nodes (27): CreateEvaluationTemplates1751337696278, DevicesModule, Module, EvaluationTemplateCriteria, ApiProperty, ApiPropertyOptional, Column, Entity (+19 more)

### Community 14 - "treatments.service.ts"
Cohesion: 0.19
Nodes (9): src_repositories_treatments_dto_index_calculatetreatmentdto, src_repositories_treatments_dto_index_querytreatmentdto, src_repositories_treatments_dto_index_treatmentcalculationsdto, TreatmentCalculationsDto, ApiProperty, UpdateTreatmentDto, CalculateTreatmentValidationPipe, Injectable (+1 more)

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - "ThermalTreatmentInput"
Cohesion: 0.21
Nodes (13): ReportsController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body, Controller, Post (+5 more)

### Community 17 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier, jest, @nestjs/cli, @nestjs/schematics, @nestjs/testing (+15 more)

### Community 18 - "AppService"
Cohesion: 0.18
Nodes (7): AppController, Body, Controller, Get, Post, AppService, Injectable

### Community 19 - "evaluations.service.ts"
Cohesion: 0.08
Nodes (25): class-transformer, class-validator, CreateEvaluationCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsNotEmpty (+17 more)

### Community 20 - "users.service.ts"
Cohesion: 0.23
Nodes (8): ref_crypto, src_common_use_case_index_crudrepository, src_repositories_users_dto_index_createuserdto, src_repositories_users_dto_index_updateuserdto, src_repositories_users_dto_index_userresponsedto, UpdateUserDto, src_repositories_users_entities_index_user, ALLOWED_SORT

### Community 21 - "CurrentUser"
Cohesion: 0.21
Nodes (15): CurrentUser, EvaluationsController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller (+7 more)

### Community 22 - "typeorm"
Cohesion: 0.21
Nodes (11): ref_dotenv, typeorm, IdEntity, ApiProperty, Column, CreateDateColumn, PrimaryGeneratedColumn, src_repositories_base_index_identity (+3 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+11 more)

### Community 24 - "README.md"
Cohesion: 0.05
Nodes (37): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+29 more)

### Community 25 - "@nestjs/swagger"
Cohesion: 0.15
Nodes (12): IsDate, @nestjs/swagger, BaseResponseDto, ApiProperty, IsBoolean, IsNotEmpty, IsNumber, IsOptional (+4 more)

### Community 26 - "treatment-options.service.ts"
Cohesion: 0.11
Nodes (11): @nestjs/testing, src_common_pagination_dto_index_querybasedto, PaginationDataDto, ApiProperty, CrudRepository, src_repositories_treatment_options_dto_index_createtreatmentoptiondto, src_repositories_treatment_options_dto_index_treatmentoptionlistdto, src_repositories_treatment_options_dto_index_treatmentoptionresponsedto (+3 more)

### Community 27 - "thermal-analysis.service.ts"
Cohesion: 0.11
Nodes (22): allPass(), bisect(), checkCriteria(), CriterionResult, DESIGN_VARS, DesignVar, DiagnoseResult, Distribution (+14 more)

### Community 28 - "devices.service.ts"
Cohesion: 0.09
Nodes (39): serialport, @serialport/parser-readline, src_auth_decorators_index_currentuser, src_auth_guards_index_adminguard, calibrate(), ChannelLike, COMMAND_REGEX, evalRule() (+31 more)

### Community 29 - "EvaluationsService"
Cohesion: 0.23
Nodes (5): EvaluationsService, ApiOperation, ApiResponse, ApiTags, Injectable

### Community 30 - "main.ts"
Cohesion: 0.14
Nodes (10): Catch, cookie-parser, csurf, helmet, @nestjs/core, JwtAuthGuard, Injectable, HttpExceptionFilter (+2 more)

### Community 31 - "User"
Cohesion: 0.29
Nodes (6): BeforeInsert, ApiProperty, ApiPropertyOptional, Column, Entity, User

### Community 32 - "CreateExternalTreatmentDto"
Cohesion: 0.20
Nodes (10): CreateExternalTreatmentDto, ApiProperty, ApiPropertyOptional, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 33 - "CreateEvaluationDto"
Cohesion: 0.15
Nodes (13): ArrayMinSize, IsArray, CreateEvaluationDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsDateString, IsEnum (+5 more)

### Community 34 - "ThermalCalculationsController"
Cohesion: 0.26
Nodes (11): ThermalCalculationsController, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags, Body (+3 more)

### Community 35 - "TreatmentResponseDto"
Cohesion: 0.18
Nodes (18): TreatmentResponseDto, ApiProperty, TreatmentsController, ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse (+10 more)

### Community 36 - ".login"
Cohesion: 0.18
Nodes (13): ApiCookieAuth, Req, AuthController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body (+5 more)

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "DeviceChannel"
Cohesion: 0.28
Nodes (17): InjectRepository, ChannelReading, Device, DeviceChannel, DeviceCommandLog, DeviceRule, PidLoop, ApiProperty (+9 more)

### Community 40 - "DaysOfWeek"
Cohesion: 0.20
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 41 - "CreateTemplateCriteriaDto"
Cohesion: 0.20
Nodes (10): CreateTemplateCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 42 - "test.service.ts"
Cohesion: 0.06
Nodes (42): @nestjs/typeorm, src_common_pagination_dto_index_paginationdto, CreateTestDto, ApiProperty, IsNotEmpty, IsString, MaxLength, src_repositories_test_dto_index_createtestdto (+34 more)

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

### Community 52 - "app.module.ts"
Cohesion: 0.16
Nodes (10): ref_fs, @nestjs/serve-static, ref_path, supertest, AppModule, Module, AuthModule, Module (+2 more)

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
Cohesion: 0.16
Nodes (5): AuthService, Injectable, InjectRepository, JwtStrategy, Injectable

### Community 58 - "evaluation-response.dto.ts"
Cohesion: 0.19
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

### Community 73 - "id.create.ts"
Cohesion: 0.40
Nodes (4): IdCreateEntity, ApiProperty, IsNotEmpty, IsNumber

### Community 74 - "@nestjs/common"
Cohesion: 0.23
Nodes (6): @nestjs/common, CalculationCriteria, ComparisonOperator, EvaluationCalculationResult, ApiProperty, EvaluationReportData

### Community 75 - "UserRole"
Cohesion: 0.18
Nodes (7): AdminGuard, Injectable, SeedAdminAndOperatorUsers1751178224375, src_repositories_users_entities_index_userrole, UserRole, ADMIN, OPERATOR

### Community 76 - "Treatment"
Cohesion: 0.10
Nodes (16): CreateSampleTreatments1751337651500, ExternalTreatment, ApiProperty, ApiPropertyOptional, Column, Entity, src_repositories_evaluations_entities_index_evaluation, src_repositories_evaluations_entities_index_evaluationcriteria (+8 more)

### Community 80 - "auth/dto/index.ts"
Cohesion: 0.35
Nodes (7): AuthResponseDto, ApiProperty, LoginResponseDto, ApiProperty, UserDataDto, RegisterResponseDto, ApiProperty

### Community 81 - "Evaluation"
Cohesion: 0.09
Nodes (22): CreateSampleEvaluations1751337651990, EvaluationCriteria, ApiProperty, ApiPropertyOptional, Column, Entity, ManyToOne, Evaluation (+14 more)

### Community 82 - "CreateUserDto"
Cohesion: 0.22
Nodes (8): CreateUserDto, ApiProperty, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength

### Community 83 - "CreateTreatmentDto"
Cohesion: 0.20
Nodes (9): CreateTreatmentDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max (+1 more)

### Community 85 - "UsersService"
Cohesion: 0.27
Nodes (3): Injectable, InjectRepository, UsersService

### Community 86 - "create-test.dto.ts"
Cohesion: 0.22
Nodes (6): BaseEntityDto, ApiPropertyOptional, IsBoolean, IsNumber, IsOptional, src_repositories_base_index_baseentitydto

### Community 87 - ".update"
Cohesion: 0.28
Nodes (6): ApiBadRequestResponse, ApiBody, ApiCreatedResponse, Body, Patch, Post

### Community 88 - "RegisterDto"
Cohesion: 0.33
Nodes (5): RegisterDto, IsEmail, IsNotEmpty, IsString, MinLength

### Community 89 - "LoginDto"
Cohesion: 0.40
Nodes (4): LoginDto, IsEmail, IsNotEmpty, IsString

### Community 92 - "QueryEvaluationDto"
Cohesion: 0.25
Nodes (8): QueryEvaluationDto, ApiPropertyOptional, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Type

## Knowledge Gaps
- **305 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+300 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 675 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `auth.service.ts`, `treatment-options.service.ts`, `package.json`, `trials.controller.ts`, `test.service.ts`, `UserRole`, `evaluations.module.ts`, `treatments.service.ts`, `AppService`, `evaluations.service.ts`, `app.module.ts`, `users.service.ts`, `jwt-auth.guard.ts`, `thermal-analysis.service.ts`, `devices.service.ts`, `main.ts`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `auth.service.ts`, `package.json`, `trials.controller.ts`, `treatments.service.ts`, `evaluations.service.ts`, `users.service.ts`, `typeorm`, `treatment-options.service.ts`, `thermal-analysis.service.ts`, `devices.service.ts`, `main.ts`, `test.service.ts`, `app.module.ts`, `evaluation-response.dto.ts`, `id.create.ts`, `@nestjs/common`, `auth/dto/index.ts`, `CreateUserDto`, `create-test.dto.ts`, `LogoutResponseDto`?**
  _High betweenness centrality (0.129) - this node is a cross-community bridge._
- **Why does `typeorm` connect `typeorm` to `auth.service.ts`, `package.json`, `trials.controller.ts`, `evaluations.module.ts`, `treatments.service.ts`, `evaluations.service.ts`, `users.service.ts`, `treatment-options.service.ts`, `devices.service.ts`, `test.service.ts`, `bcrypt`, `AddTrials1794021872972`, `SeedTrialAndDeviceData1794021872973`, `SeedTreatmentOptions1751181394026`, `CreateUnaccentExtension1752379896329`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `UserRole`, `Treatment`, `AddDevices1794006813002`, `SeedAllModules1794108000000`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _305 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TreatmentOptionService` be split into smaller, more focused modules?**
  _Cohesion score 0.0707070707070707 - nodes in this community are weakly interconnected._
- **Should `UserResponseDto` be split into smaller, more focused modules?**
  _Cohesion score 0.13405797101449277 - nodes in this community are weakly interconnected._
- **Should `ThermalCalculatorService` be split into smaller, more focused modules?**
  _Cohesion score 0.07982583454281568 - nodes in this community are weakly interconnected._
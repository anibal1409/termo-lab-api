# Graph Report - termo-lab-api  (2026-11-06)

## Corpus Check
- 174 files · ~67,979 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ino 1, .code-workspace 1)

## Summary
- 1411 nodes · 3185 edges · 95 communities (80 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 96 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `162a01e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- auth.service.ts
- TreatmentOptionController
- .update
- ThermalCalculatorService
- devices.dto.ts
- DevicesController
- package.json
- TreatmentResponseDto
- dependencies
- TreatmentsService
- users.service.ts
- QueryBaseDto
- scripts
- evaluations.module.ts
- treatments.service.ts
- additionalProperties
- ReportsController
- devDependencies
- AppService
- @nestjs/swagger
- evaluations.service.ts
- User
- typeorm
- compilerOptions
- Scripts Disponibles
- BaseResponseDto
- treatment-options.service.ts
- test.service.ts
- evaluation-response.dto.ts
- TestController
- main.ts
- DevicesService
- CreateExternalTreatmentDto
- CreateEvaluationDto
- .calculateThermalResults
- README.md
- CreateEvaluationCriteriaDto
- 4. Fórmulas de Flujos y Caudales
- bcrypt
- control.ts
- DaysOfWeek
- CreateTemplateCriteriaDto
- TestService
- CreateTreatmentDto
- 5. Fórmulas de Áreas y Volúmenes
- jest
- DeviceChannel
- CreateTestDto
- @nestjs/testing
- Treatment
- Fórmulas Implementadas en el Sistema Termo-Lab
- 7. Fórmulas de Decantación
- app.module.ts
- 10. Fórmulas de Evaluación
- 9. Fórmulas de Boquillas
- nest-cli.json
- SeedTreatmentOptions1751181394026
- EvaluationTemplate
- TreatmentOptionService
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
- IdCreateEntity
- @nestjs/common
- EvaluationType
- UserRole
- start-backend-debug.sh
- TreatmentOptionResponseDto
- SerialConnection
- 1751337651990-CreateSampleEvaluations.ts
- ChannelType
- evaluation-calculator.service.ts
- AddDevices1794006813002
- devices.service.ts
- TestResponseDto
- UserResponseDto
- UsersService
- Test
- CreateTreatmentOptionDto
- CreateUserDto
- QueryEvaluationDto
- 1751337651500-CreateSampleTreatments.ts
- data-source.ts

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 63 edges
2. `ThermalCalculatorService` - 56 edges
3. `User` - 56 edges
4. `DevicesService` - 54 edges
5. `@nestjs/common` - 41 edges
6. `TreatmentsService` - 36 edges
7. `Evaluation` - 32 edges
8. `typeorm` - 31 edges
9. `DevicesController` - 30 edges
10. `EvaluationsService` - 30 edges

## Surprising Connections (you probably didn't know these)
- `TreatmentsController` --references--> `Public()`  [EXTRACTED]
  src/repositories/treatments/treatments.controller.ts → src/auth/decorators/public.decorator.ts
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

## Communities (95 total, 15 thin omitted)

### Community 0 - "auth.service.ts"
Cohesion: 0.05
Nodes (46): ApiCookieAuth, ref_express, @nestjs/config, @nestjs/jwt, @nestjs/passport, Req, Res, AuthController (+38 more)

### Community 1 - "TreatmentOptionController"
Cohesion: 0.20
Nodes (9): TreatmentOptionController, ApiOperation, ApiResponse, ApiTags, Controller, Delete, Get, Param (+1 more)

### Community 2 - ".update"
Cohesion: 0.18
Nodes (13): ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, Body, Controller (+5 more)

### Community 4 - "devices.dto.ts"
Cohesion: 0.20
Nodes (23): ArrayMaxSize, IsInt, Matches, CreateChannelDto, CreateDeviceDto, CreatePidDto, CreateRuleDto, RawCommandDto (+15 more)

### Community 5 - "DevicesController"
Cohesion: 0.14
Nodes (15): DevicesController, Id(), ApiOkResponse, ApiOperation, ApiQuery, ApiTags, Body, Controller (+7 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (40): author, description, license, name, private, version, eslint, eslint-config-prettier (+32 more)

### Community 7 - "TreatmentResponseDto"
Cohesion: 0.19
Nodes (15): TreatmentResponseDto, ApiProperty, TreatmentsController, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery (+7 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, bcrypt, class-transformer, class-validator, cookie-parser, csurf, express-session, helmet (+24 more)

### Community 9 - "TreatmentsService"
Cohesion: 0.12
Nodes (8): CalculateTreatmentDto, ApiProperty, IsNotEmpty, IsNumber, Max, Min, TreatmentsService, Injectable

### Community 10 - "users.service.ts"
Cohesion: 0.27
Nodes (5): src_repositories_users_dto_index_createuserdto, src_repositories_users_dto_index_updateuserdto, src_repositories_users_dto_index_userresponsedto, UpdateUserDto, src_repositories_users_entities_index_user

### Community 11 - "QueryBaseDto"
Cohesion: 0.12
Nodes (17): PaginationDto, QueryBaseDto, ApiPropertyOptional, IsIn, IsNumber, IsOptional, IsString, Type (+9 more)

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 13 - "evaluations.module.ts"
Cohesion: 0.12
Nodes (17): @nestjs/typeorm, DevicesModule, Module, EvaluationsModule, Module, src_repositories_evaluations_services_index_evaluationcalculatorservice, src_repositories_evaluations_services_index_evaluationsservice, src_repositories_evaluations_services_index_reportgeneratorservice (+9 more)

### Community 14 - "treatments.service.ts"
Cohesion: 0.18
Nodes (10): src_auth_decorators_index_public, src_repositories_treatments_dto_index_calculatetreatmentdto, src_repositories_treatments_dto_index_querytreatmentdto, src_repositories_treatments_dto_index_treatmentcalculationsdto, TreatmentCalculationsDto, ApiProperty, UpdateTreatmentDto, CalculateTreatmentValidationPipe (+2 more)

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - "ReportsController"
Cohesion: 0.32
Nodes (8): ReportsController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body, Controller, Post

### Community 17 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier, jest, @nestjs/cli, @nestjs/schematics, @nestjs/testing (+15 more)

### Community 18 - "AppService"
Cohesion: 0.18
Nodes (7): AppController, Body, Controller, Get, Post, AppService, Injectable

### Community 19 - "@nestjs/swagger"
Cohesion: 0.34
Nodes (3): class-transformer, class-validator, @nestjs/swagger

### Community 20 - "evaluations.service.ts"
Cohesion: 0.18
Nodes (11): src_auth_decorators_index_currentuser, src_auth_guards_index_jwtauthguard, src_common_pagination_dto_index_paginationdto, EvaluationTemplateResponseDto, ApiProperty, src_repositories_evaluations_dto_index_createevaluationcriteriadto, src_repositories_evaluations_dto_index_createevaluationdto, src_repositories_evaluations_dto_index_createexternaltreatmentdto (+3 more)

### Community 21 - "User"
Cohesion: 0.06
Nodes (44): ApiBearerAuth, BeforeInsert, CurrentUser, CreateSampleEvaluations1751337651990, EvaluationsController, ApiOperation, ApiResponse, ApiTags (+36 more)

### Community 22 - "typeorm"
Cohesion: 0.27
Nodes (9): ref_crypto, typeorm, IdEntity, ApiProperty, Column, CreateDateColumn, PrimaryGeneratedColumn, src_repositories_base_index_identity (+1 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+11 more)

### Community 24 - "Scripts Disponibles"
Cohesion: 0.12
Nodes (15): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+7 more)

### Community 25 - "BaseResponseDto"
Cohesion: 0.12
Nodes (13): IsDate, BaseResponseDto, ApiProperty, IsBoolean, IsNotEmpty, IsNumber, IsOptional, Type (+5 more)

### Community 26 - "treatment-options.service.ts"
Cohesion: 0.20
Nodes (8): src_common_pagination_dto_index_querybasedto, PaginationDataDto, ApiProperty, src_common_use_case_index_crudrepository, src_repositories_treatment_options_dto_index_createtreatmentoptiondto, src_repositories_treatment_options_dto_index_treatmentoptionlistdto, src_repositories_treatment_options_dto_index_treatmentoptionresponsedto, src_repositories_treatment_options_dto_index_updatetreatmentoptiondto

### Community 27 - "test.service.ts"
Cohesion: 0.30
Nodes (6): src_repositories_test_dto_index_createtestdto, src_repositories_test_dto_index_testresponsedto, src_repositories_test_dto_index_updatetestdto, src_repositories_test_entities_index_test, TestModule, Module

### Community 28 - "evaluation-response.dto.ts"
Cohesion: 0.17
Nodes (9): EvaluationCriteriaResponseDto, ApiProperty, ApiPropertyOptional, EvaluationResponseDto, ApiProperty, ApiPropertyOptional, ExternalTreatmentResponseDto, ApiProperty (+1 more)

### Community 29 - "TestController"
Cohesion: 0.13
Nodes (15): TestController, ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam (+7 more)

### Community 30 - "main.ts"
Cohesion: 0.15
Nodes (9): Catch, cookie-parser, csurf, @nestjs/core, IS_PUBLIC_KEY, JwtAuthGuard, Injectable, HttpExceptionFilter (+1 more)

### Community 31 - "DevicesService"
Cohesion: 0.14
Nodes (4): isOutput(), DevicesService, pinNumber(), Injectable

### Community 32 - "CreateExternalTreatmentDto"
Cohesion: 0.20
Nodes (10): CreateExternalTreatmentDto, ApiProperty, ApiPropertyOptional, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 33 - "CreateEvaluationDto"
Cohesion: 0.17
Nodes (12): IsArray, CreateEvaluationDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsDateString, IsEnum, IsNumber (+4 more)

### Community 34 - ".calculateThermalResults"
Cohesion: 0.29
Nodes (8): ThermalCalculationsController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body, Controller, Post

### Community 35 - "README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Project setup, Resources, Run tests, Stay in touch (+2 more)

### Community 36 - "CreateEvaluationCriteriaDto"
Cohesion: 0.18
Nodes (11): CreateEvaluationCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString (+3 more)

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 39 - "control.ts"
Cohesion: 0.11
Nodes (21): serialport, @serialport/parser-readline, calibrate(), ChannelLike, COMMAND_REGEX, evalRule(), OUTPUT_TYPES, outputRange() (+13 more)

### Community 40 - "DaysOfWeek"
Cohesion: 0.18
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 41 - "CreateTemplateCriteriaDto"
Cohesion: 0.20
Nodes (10): CreateTemplateCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 42 - "TestService"
Cohesion: 0.24
Nodes (3): Param, TestService, Injectable

### Community 43 - "CreateTreatmentDto"
Cohesion: 0.15
Nodes (14): CreateTreatmentDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max (+6 more)

### Community 44 - "5. Fórmulas de Áreas y Volúmenes"
Cohesion: 0.22
Nodes (9): 5.1 Área Total del Recipiente (Ecuación 1.10), 5.2 Área desde el Fondo al Nivel Bajo Bajo de Agua (Ecuación 1.9), 5.3 Área Ocupada por el Agua (Ecuación 1.17 / Ec. 26), 5.4 Área Ocupada por el Crudo (Ecuación 1.4 / Ec. 13), 5.5 Área Disponible para el Gas (Ecuación 1.11), 5.6 Área Requerida para el Gas (Ecuación 1.15 / Ec. 25), 5.7 Volumen de Retención del Crudo (Ecuación 1.5), 5.8 Volumen de Retención del Agua (Ecuación 1.12) (+1 more)

### Community 45 - "jest"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 46 - "DeviceChannel"
Cohesion: 0.26
Nodes (18): Index, InjectRepository, ChannelReading, Device, DeviceChannel, DeviceCommandLog, DeviceRule, double (+10 more)

### Community 47 - "CreateTestDto"
Cohesion: 0.16
Nodes (12): BaseEntityDto, ApiPropertyOptional, IsBoolean, IsNumber, IsOptional, src_repositories_base_index_baseentitydto, CreateTestDto, ApiProperty (+4 more)

### Community 49 - "Treatment"
Cohesion: 0.22
Nodes (7): Treatment, ApiProperty, Column, Entity, JoinColumn, ManyToOne, InjectRepository

### Community 50 - "Fórmulas Implementadas en el Sistema Termo-Lab"
Cohesion: 0.29
Nodes (6): Backend (termo-lab-api), Fórmulas Implementadas en el Sistema Termo-Lab, 📝 Notas Importantes, 🔍 Referencias, 📊 Resumen de Archivos, 📋 Índice

### Community 51 - "7. Fórmulas de Decantación"
Cohesion: 0.29
Nodes (7): 7.1 Velocidad de Decantación de la Fase Pesada (Ecuación 1.22), 7.2 Tiempo de Decantación de la Fase Pesada (Ecuación 1.23), 7.3 Tiempo de Decantación de la Fase Liviana (Ecuación 1.24 / Ec. 33), 7.4 Porcentaje de Deshidratación del Equipo (Ecuación 1.19 / Ec. 28), 7.5 Cantidad de Agua Saliendo con el Crudo (Ecuación 1.18 / Ec. 27), 7.6 Corte de Agua del Crudo Saliendo (Ecuación 1.13 / Ec. 23), 7. Fórmulas de Decantación

### Community 52 - "app.module.ts"
Cohesion: 0.18
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

### Community 57 - "EvaluationTemplate"
Cohesion: 0.12
Nodes (15): CreateEvaluationTemplates1751337696278, EvaluationTemplateCriteria, ApiProperty, ApiPropertyOptional, Column, Entity, ManyToOne, EvaluationTemplate (+7 more)

### Community 58 - "TreatmentOptionService"
Cohesion: 0.21
Nodes (8): TreatmentOption, ApiProperty, ApiPropertyOptional, Column, Entity, TreatmentOptionService, Injectable, InjectRepository

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

### Community 73 - "IdCreateEntity"
Cohesion: 0.50
Nodes (4): IdCreateEntity, ApiProperty, IsNotEmpty, IsNumber

### Community 74 - "@nestjs/common"
Cohesion: 0.28
Nodes (7): @nestjs/common, EvaluationReportData, ReportGeneratorService, Injectable, ThermalCalculationResults, ThermalTreatmentInput, ApiProperty

### Community 75 - "EvaluationType"
Cohesion: 0.67
Nodes (3): EvaluationType, EXTERNAL, INTERNAL

### Community 76 - "UserRole"
Cohesion: 0.18
Nodes (7): AdminGuard, Injectable, SeedAdminAndOperatorUsers1751178224375, src_repositories_users_entities_index_userrole, UserRole, ADMIN, OPERATOR

### Community 79 - "TreatmentOptionResponseDto"
Cohesion: 0.25
Nodes (6): Put, TreatmentOptionResponseDto, ApiProperty, UpdateTreatmentOptionDto, Body, Post

### Community 81 - "1751337651990-CreateSampleEvaluations.ts"
Cohesion: 0.20
Nodes (9): ExternalTreatment, ApiProperty, ApiPropertyOptional, Column, Entity, src_repositories_evaluations_entities_index_evaluation, src_repositories_evaluations_entities_index_evaluationcriteria, src_repositories_evaluations_entities_index_externaltreatment (+1 more)

### Community 82 - "ChannelType"
Cohesion: 0.22
Nodes (9): ChannelType, ANALOG_IN, DIGITAL_IN, DIGITAL_OUT, DS18B20, MAX31865, MAX6675, PWM (+1 more)

### Community 83 - "evaluation-calculator.service.ts"
Cohesion: 0.40
Nodes (3): CalculationCriteria, EvaluationCalculationResult, ApiProperty

### Community 85 - "devices.service.ts"
Cohesion: 0.17
Nodes (17): rxjs, src_auth_guards_index_adminguard, PidState, UpdateChannelDto, UpdateDeviceDto, UpdatePidDto, UpdateRuleDto, LiveEvent (+9 more)

### Community 86 - "TestResponseDto"
Cohesion: 0.24
Nodes (6): TestResponseDto, ApiProperty, IsNotEmpty, IsString, Body, Query

### Community 87 - "UserResponseDto"
Cohesion: 0.22
Nodes (6): ApiProperty, ApiPropertyOptional, UserResponseDto, ApiBadRequestResponse, ApiCreatedResponse, Post

### Community 88 - "UsersService"
Cohesion: 0.27
Nodes (3): Injectable, InjectRepository, UsersService

### Community 89 - "Test"
Cohesion: 0.22
Nodes (5): Test, ApiProperty, Column, Entity, InjectRepository

### Community 90 - "CreateTreatmentOptionDto"
Cohesion: 0.22
Nodes (9): CreateTreatmentOptionDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max (+1 more)

### Community 91 - "CreateUserDto"
Cohesion: 0.25
Nodes (8): MinLength, CreateUserDto, ApiProperty, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString

### Community 92 - "QueryEvaluationDto"
Cohesion: 0.25
Nodes (8): QueryEvaluationDto, ApiPropertyOptional, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Type

## Knowledge Gaps
- **284 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+279 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 625 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `auth.service.ts`, `package.json`, `control.ts`, `users.service.ts`, `UserRole`, `evaluations.module.ts`, `treatments.service.ts`, `AppService`, `evaluation-calculator.service.ts`, `app.module.ts`, `devices.service.ts`, `evaluations.service.ts`, `treatment-options.service.ts`, `test.service.ts`, `main.ts`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `auth.service.ts`, `devices.dto.ts`, `package.json`, `TreatmentsService`, `users.service.ts`, `treatments.service.ts`, `evaluations.service.ts`, `typeorm`, `BaseResponseDto`, `treatment-options.service.ts`, `test.service.ts`, `evaluation-response.dto.ts`, `main.ts`, `DeviceChannel`, `CreateTestDto`, `app.module.ts`, `@nestjs/common`, `evaluation-calculator.service.ts`, `devices.service.ts`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `DevicesService` connect `DevicesService` to `devices.dto.ts`, `DevicesController`, `control.ts`, `DeviceChannel`, `SerialConnection`, `devices.service.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _284 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `auth.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.053613053613053616 - nodes in this community are weakly interconnected._
- **Should `ThermalCalculatorService` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `DevicesController` be split into smaller, more focused modules?**
  _Cohesion score 0.13636363636363635 - nodes in this community are weakly interconnected._
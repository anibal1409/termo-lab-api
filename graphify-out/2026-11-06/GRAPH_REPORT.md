# Graph Report - termo-lab-api  (2026-11-06)

## Corpus Check
- 174 files · ~65,031 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ino 1, .code-workspace 1)

## Summary
- 1410 nodes · 3158 edges · 86 communities (71 shown, 15 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 96 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `162a01e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- auth.service.ts
- TreatmentOptionService
- users.service.ts
- ThermalCalculatorService
- CurrentUser
- DevicesController
- package.json
- TreatmentResponseDto
- dependencies
- TreatmentsService
- Evaluation
- QueryBaseDto
- scripts
- evaluations.module.ts
- treatments.service.ts
- additionalProperties
- ReportsController
- devDependencies
- app.module.ts
- @nestjs/swagger
- evaluations.service.ts
- EvaluationsService
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
- devices.service.ts
- DaysOfWeek
- CreateTemplateCriteriaDto
- TestResponseDto
- CreateTreatmentDto
- 5. Fórmulas de Áreas y Volúmenes
- jest
- DeviceChannel
- .login
- @nestjs/testing
- Treatment
- Fórmulas Implementadas en el Sistema Termo-Lab
- 7. Fórmulas de Decantación
- auth.module.ts
- 10. Fórmulas de Evaluación
- 9. Fórmulas de Boquillas
- nest-cli.json
- SeedTreatmentOptions1751181394026
- EvaluationTemplate
- QueryTreatmentDto
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
- .disconnect
- start-backend-debug.sh
- AuthService
- SerialConnection
- User
- ChannelType
- evaluation-calculator.service.ts
- AddDevices1794006813002
- devices.module.ts

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
- `QueryTreatmentDto` --inherits--> `QueryBaseDto`  [EXTRACTED]
  src/repositories/treatments/dto/query-treatment.dto.ts → src/common/pagination/dto/query-base.dto.ts
- `TestService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/test/test.service.ts → src/common/use-case/crud-repository.ts
- `TreatmentOptionService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/treatment-options/treatment-options.service.ts → src/common/use-case/crud-repository.ts

## Import Cycles
- None detected.

## Communities (86 total, 15 thin omitted)

### Community 0 - "auth.service.ts"
Cohesion: 0.11
Nodes (23): ref_express, AuthResponseDto, ApiProperty, src_auth_dto_index_logindto, src_auth_dto_index_loginresponsedto, src_auth_dto_index_logoutresponsedto, src_auth_dto_index_registerdto, src_auth_dto_index_registerresponsedto (+15 more)

### Community 1 - "TreatmentOptionService"
Cohesion: 0.09
Nodes (23): Put, TreatmentOptionResponseDto, ApiProperty, TreatmentOption, ApiProperty, ApiPropertyOptional, Column, Entity (+15 more)

### Community 2 - "users.service.ts"
Cohesion: 0.05
Nodes (42): MinLength, AdminGuard, Injectable, src_common_pagination_dto_index_paginationdto, SeedAdminAndOperatorUsers1751178224375, CreateSampleTreatments1751337651500, CreateUserDto, ApiProperty (+34 more)

### Community 4 - "CurrentUser"
Cohesion: 0.19
Nodes (15): ApiBearerAuth, CurrentUser, EvaluationsController, ApiOperation, ApiResponse, ApiTags, Body, Controller (+7 more)

### Community 5 - "DevicesController"
Cohesion: 0.07
Nodes (43): ArrayMaxSize, IsInt, Matches, src_auth_guards_index_adminguard, PIN_REGEX, DevicesController, Id(), ApiOperation (+35 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (41): author, description, license, name, private, version, eslint, eslint-config-prettier (+33 more)

### Community 7 - "TreatmentResponseDto"
Cohesion: 0.15
Nodes (20): TreatmentResponseDto, ApiProperty, TreatmentsController, ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse (+12 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, bcrypt, class-transformer, class-validator, cookie-parser, csurf, express-session, helmet (+24 more)

### Community 9 - "TreatmentsService"
Cohesion: 0.13
Nodes (8): CalculateTreatmentDto, ApiProperty, IsNotEmpty, IsNumber, Max, Min, TreatmentsService, Injectable

### Community 10 - "Evaluation"
Cohesion: 0.12
Nodes (16): CreateSampleEvaluations1751337651990, EvaluationCriteria, ApiProperty, ApiPropertyOptional, Column, Entity, ManyToOne, Evaluation (+8 more)

### Community 11 - "QueryBaseDto"
Cohesion: 0.16
Nodes (13): PaginationDataDto, PaginationDto, ApiProperty, QueryBaseDto, ApiPropertyOptional, IsIn, IsNumber, IsOptional (+5 more)

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 13 - "evaluations.module.ts"
Cohesion: 0.12
Nodes (17): @nestjs/typeorm, DevicesModule, Module, EvaluationsModule, Module, src_repositories_evaluations_services_index_evaluationcalculatorservice, src_repositories_evaluations_services_index_evaluationsservice, src_repositories_evaluations_services_index_reportgeneratorservice (+9 more)

### Community 14 - "treatments.service.ts"
Cohesion: 0.17
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

### Community 18 - "app.module.ts"
Cohesion: 0.15
Nodes (10): @nestjs/serve-static, AppController, Body, Controller, Get, Post, AppService, Injectable (+2 more)

### Community 19 - "@nestjs/swagger"
Cohesion: 0.17
Nodes (9): class-transformer, class-validator, @nestjs/swagger, BaseEntityDto, ApiPropertyOptional, IsBoolean, IsNumber, IsOptional (+1 more)

### Community 20 - "evaluations.service.ts"
Cohesion: 0.08
Nodes (26): src_auth_decorators_index_currentuser, src_auth_guards_index_jwtauthguard, EvaluationTemplateResponseDto, ApiProperty, src_repositories_evaluations_dto_index_createevaluationcriteriadto, src_repositories_evaluations_dto_index_createevaluationdto, src_repositories_evaluations_dto_index_createexternaltreatmentdto, src_repositories_evaluations_dto_index_queryevaluationdto (+18 more)

### Community 21 - "EvaluationsService"
Cohesion: 0.19
Nodes (7): EvaluationCalculatorService, Injectable, EvaluationsService, ApiOperation, ApiResponse, ApiTags, Injectable

### Community 22 - "typeorm"
Cohesion: 0.23
Nodes (10): ref_crypto, ref_dotenv, typeorm, IdEntity, ApiProperty, Column, CreateDateColumn, PrimaryGeneratedColumn (+2 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+11 more)

### Community 24 - "Scripts Disponibles"
Cohesion: 0.12
Nodes (15): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+7 more)

### Community 25 - "BaseResponseDto"
Cohesion: 0.11
Nodes (15): IsDate, BaseResponseDto, ApiProperty, IsBoolean, IsNotEmpty, IsNumber, IsOptional, Type (+7 more)

### Community 26 - "treatment-options.service.ts"
Cohesion: 0.12
Nodes (18): src_common_pagination_dto_index_querybasedto, src_common_use_case_index_crudrepository, CreateTreatmentOptionDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional (+10 more)

### Community 27 - "test.service.ts"
Cohesion: 0.18
Nodes (12): CreateTestDto, ApiProperty, IsNotEmpty, IsString, MaxLength, src_repositories_test_dto_index_createtestdto, src_repositories_test_dto_index_testresponsedto, src_repositories_test_dto_index_updatetestdto (+4 more)

### Community 28 - "evaluation-response.dto.ts"
Cohesion: 0.20
Nodes (9): EvaluationCriteriaResponseDto, ApiProperty, ApiPropertyOptional, EvaluationResponseDto, ApiProperty, ApiPropertyOptional, ExternalTreatmentResponseDto, ApiProperty (+1 more)

### Community 29 - "TestController"
Cohesion: 0.13
Nodes (15): TestController, ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam (+7 more)

### Community 30 - "main.ts"
Cohesion: 0.10
Nodes (14): Catch, cookie-parser, csurf, ref_fs, @nestjs/core, @nestjs/passport, ref_path, AppModule (+6 more)

### Community 31 - "DevicesService"
Cohesion: 0.17
Nodes (4): isOutput(), validatePins(), DevicesService, Injectable

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

### Community 39 - "devices.service.ts"
Cohesion: 0.10
Nodes (28): serialport, @serialport/parser-readline, calibrate(), ChannelLike, COMMAND_REGEX, evalRule(), OUTPUT_TYPES, outputRange() (+20 more)

### Community 40 - "DaysOfWeek"
Cohesion: 0.20
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 41 - "CreateTemplateCriteriaDto"
Cohesion: 0.20
Nodes (10): CreateTemplateCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 42 - "TestResponseDto"
Cohesion: 0.11
Nodes (13): TestResponseDto, ApiProperty, IsNotEmpty, IsString, Test, ApiProperty, Column, Entity (+5 more)

### Community 43 - "CreateTreatmentDto"
Cohesion: 0.22
Nodes (9): CreateTreatmentDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max (+1 more)

### Community 44 - "5. Fórmulas de Áreas y Volúmenes"
Cohesion: 0.22
Nodes (9): 5.1 Área Total del Recipiente (Ecuación 1.10), 5.2 Área desde el Fondo al Nivel Bajo Bajo de Agua (Ecuación 1.9), 5.3 Área Ocupada por el Agua (Ecuación 1.17 / Ec. 26), 5.4 Área Ocupada por el Crudo (Ecuación 1.4 / Ec. 13), 5.5 Área Disponible para el Gas (Ecuación 1.11), 5.6 Área Requerida para el Gas (Ecuación 1.15 / Ec. 25), 5.7 Volumen de Retención del Crudo (Ecuación 1.5), 5.8 Volumen de Retención del Agua (Ecuación 1.12) (+1 more)

### Community 45 - "jest"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 46 - "DeviceChannel"
Cohesion: 0.26
Nodes (18): Index, InjectRepository, ChannelReading, Device, DeviceChannel, DeviceCommandLog, DeviceRule, double (+10 more)

### Community 47 - ".login"
Cohesion: 0.20
Nodes (13): ApiCookieAuth, Req, Res, AuthController, ApiBody, ApiOperation, ApiResponse, ApiTags (+5 more)

### Community 49 - "Treatment"
Cohesion: 0.25
Nodes (6): Treatment, ApiProperty, Column, Entity, JoinColumn, ManyToOne

### Community 50 - "Fórmulas Implementadas en el Sistema Termo-Lab"
Cohesion: 0.29
Nodes (6): Backend (termo-lab-api), Fórmulas Implementadas en el Sistema Termo-Lab, 📝 Notas Importantes, 🔍 Referencias, 📊 Resumen de Archivos, 📋 Índice

### Community 51 - "7. Fórmulas de Decantación"
Cohesion: 0.29
Nodes (7): 7.1 Velocidad de Decantación de la Fase Pesada (Ecuación 1.22), 7.2 Tiempo de Decantación de la Fase Pesada (Ecuación 1.23), 7.3 Tiempo de Decantación de la Fase Liviana (Ecuación 1.24 / Ec. 33), 7.4 Porcentaje de Deshidratación del Equipo (Ecuación 1.19 / Ec. 28), 7.5 Cantidad de Agua Saliendo con el Crudo (Ecuación 1.18 / Ec. 27), 7.6 Corte de Agua del Crudo Saliendo (Ecuación 1.13 / Ec. 23), 7. Fórmulas de Decantación

### Community 52 - "auth.module.ts"
Cohesion: 0.15
Nodes (9): @nestjs/config, @nestjs/jwt, passport-jwt, AuthModule, Module, JwtPayload, src_auth_strategies_index_jwtstrategy, JwtStrategy (+1 more)

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

### Community 58 - "QueryTreatmentDto"
Cohesion: 0.33
Nodes (6): QueryTreatmentDto, ApiPropertyOptional, IsNumber, IsOptional, IsString, Type

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

### Community 79 - "AuthService"
Cohesion: 0.27
Nodes (3): AuthService, Injectable, InjectRepository

### Community 81 - "User"
Cohesion: 0.25
Nodes (6): BeforeInsert, ApiProperty, ApiPropertyOptional, Column, Entity, User

### Community 82 - "ChannelType"
Cohesion: 0.22
Nodes (9): ChannelType, ANALOG_IN, DIGITAL_IN, DIGITAL_OUT, DS18B20, MAX31865, MAX6675, PWM (+1 more)

### Community 83 - "evaluation-calculator.service.ts"
Cohesion: 0.40
Nodes (3): CalculationCriteria, EvaluationCalculationResult, ApiProperty

## Knowledge Gaps
- **284 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+279 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 631 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `auth.service.ts`, `users.service.ts`, `DevicesController`, `package.json`, `devices.service.ts`, `evaluations.module.ts`, `treatments.service.ts`, `@nestjs/testing`, `app.module.ts`, `evaluation-calculator.service.ts`, `auth.module.ts`, `devices.module.ts`, `evaluations.service.ts`, `treatment-options.service.ts`, `test.service.ts`, `main.ts`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `auth.service.ts`, `users.service.ts`, `DevicesController`, `package.json`, `@nestjs/common`, `QueryBaseDto`, `DeviceChannel`, `treatments.service.ts`, `evaluation-calculator.service.ts`, `evaluations.service.ts`, `typeorm`, `BaseResponseDto`, `treatment-options.service.ts`, `test.service.ts`, `evaluation-response.dto.ts`, `main.ts`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `typeorm` connect `typeorm` to `auth.service.ts`, `users.service.ts`, `CreateUnaccentExtension1752379896329`, `package.json`, `bcrypt`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `devices.service.ts`, `DeviceChannel`, `treatments.service.ts`, `evaluations.service.ts`, `AddDevices1794006813002`, `SeedTreatmentOptions1751181394026`, `EvaluationTemplate`, `treatment-options.service.ts`, `test.service.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _284 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `auth.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10756302521008404 - nodes in this community are weakly interconnected._
- **Should `TreatmentOptionService` be split into smaller, more focused modules?**
  _Cohesion score 0.09302325581395349 - nodes in this community are weakly interconnected._
- **Should `users.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.050239234449760764 - nodes in this community are weakly interconnected._
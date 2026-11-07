# Graph Report - termo-lab-api  (2026-11-06)

## Corpus Check
- 177 files · ~70,354 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .example 1, .ino 1)

## Summary
- 1443 nodes · 3240 edges · 88 communities (75 shown, 13 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 99 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `515b1499`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- auth.service.ts
- TreatmentOptionResponseDto
- UserResponseDto
- ThermalCalculatorService
- devices.service.ts
- DevicesService
- package.json
- TreatmentResponseDto
- dependencies
- TreatmentsService
- users.service.ts
- PaginationDto
- scripts
- treatments.module.ts
- treatments.service.ts
- additionalProperties
- ThermalTreatmentInput
- devDependencies
- app.module.ts
- @nestjs/swagger
- evaluations.service.ts
- User
- typeorm
- compilerOptions
- README.md
- BaseResponseDto
- treatment-options.service.ts
- test.service.ts
- evaluation-response.dto.ts
- TestController
- main.ts
- AuthService
- CreateExternalTreatmentDto
- CreateEvaluationDto
- .calculateThermalResults
- .login
- CreateEvaluationCriteriaDto
- 4. Fórmulas de Flujos y Caudales
- auth.controller.ts
- auth/dto/index.ts
- DaysOfWeek
- CreateTemplateCriteriaDto
- TestResponseDto
- CreateTreatmentDto
- 5. Fórmulas de Áreas y Volúmenes
- jest
- RegisterDto
- CreateTestDto
- guards/index.ts
- LoginDto
- Fórmulas Implementadas en el Sistema Termo-Lab
- 7. Fórmulas de Decantación
- jwt-auth.guard.ts
- 10. Fórmulas de Evaluación
- 9. Fórmulas de Boquillas
- nest-cli.json
- SeedTreatmentOptions1751181394026
- EvaluationTemplateCriteria
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
- id.create.ts
- @nestjs/common
- EvaluationType
- user-response.dto.ts
- start-backend-debug.sh
- src_auth_decorators_index_public
- evaluations.module.ts
- AddDevices1794006813002
- QueryBaseDto
- Test
- CreateTreatmentOptionDto
- QueryEvaluationDto
- 1751337651500-CreateSampleTreatments.ts
- data-source.ts

## God Nodes (most connected - your core abstractions)
1. `@nestjs/swagger` - 63 edges
2. `ThermalCalculatorService` - 59 edges
3. `User` - 56 edges
4. `DevicesService` - 54 edges
5. `@nestjs/common` - 42 edges
6. `TreatmentsService` - 36 edges
7. `Evaluation` - 32 edges
8. `typeorm` - 31 edges
9. `DevicesController` - 30 edges
10. `EvaluationsService` - 30 edges

## Surprising Connections (you probably didn't know these)
- `QueryEvaluationDto` --inherits--> `QueryBaseDto`  [EXTRACTED]
  src/repositories/evaluations/dto/query-evaluation.dto.ts → src/common/pagination/dto/query-base.dto.ts
- `QueryTreatmentDto` --inherits--> `QueryBaseDto`  [EXTRACTED]
  src/repositories/treatments/dto/query-treatment.dto.ts → src/common/pagination/dto/query-base.dto.ts
- `TestService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/test/test.service.ts → src/common/use-case/crud-repository.ts
- `TreatmentOptionService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/treatment-options/treatment-options.service.ts → src/common/use-case/crud-repository.ts
- `TreatmentsService` --implements--> `CrudRepository`  [EXTRACTED]
  src/repositories/treatments/treatments.service.ts → src/common/use-case/crud-repository.ts

## Import Cycles
- None detected.

## Communities (88 total, 13 thin omitted)

### Community 0 - "auth.service.ts"
Cohesion: 0.17
Nodes (9): ref_express, @nestjs/config, @nestjs/jwt, passport-jwt, JwtPayload, src_auth_strategies_index_jwtstrategy, JwtStrategy, Injectable (+1 more)

### Community 1 - "TreatmentOptionResponseDto"
Cohesion: 0.16
Nodes (16): Put, TreatmentOptionResponseDto, ApiProperty, TreatmentOptionController, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags (+8 more)

### Community 2 - "UserResponseDto"
Cohesion: 0.06
Nodes (34): CreateUserDto, ApiProperty, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength (+26 more)

### Community 4 - "devices.service.ts"
Cohesion: 0.05
Nodes (88): ArrayMaxSize, Index, IsInt, Matches, rxjs, serialport, calibrate(), ChannelLike (+80 more)

### Community 5 - "DevicesService"
Cohesion: 0.06
Nodes (20): isOutput(), writeCommand(), DevicesController, Id(), ApiOkResponse, ApiOperation, ApiQuery, ApiTags (+12 more)

### Community 6 - "package.json"
Cohesion: 0.05
Nodes (39): author, description, license, name, private, version, eslint, eslint-config-prettier (+31 more)

### Community 7 - "TreatmentResponseDto"
Cohesion: 0.20
Nodes (15): TreatmentResponseDto, ApiProperty, TreatmentsController, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery (+7 more)

### Community 8 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, bcrypt, class-transformer, class-validator, cookie-parser, csurf, express-session, helmet (+24 more)

### Community 9 - "TreatmentsService"
Cohesion: 0.12
Nodes (8): CalculateTreatmentDto, ApiProperty, IsNotEmpty, IsNumber, Max, Min, TreatmentsService, Injectable

### Community 10 - "users.service.ts"
Cohesion: 0.15
Nodes (12): ref_crypto, src_auth_decorators_index_currentuser, src_auth_guards_index_adminguard, src_common_pagination_dto_index_paginationdto, src_common_pagination_dto_index_querybasedto, pagination(), src_common_use_case_index_crudrepository, normalizeText() (+4 more)

### Community 11 - "PaginationDto"
Cohesion: 0.20
Nodes (9): PaginationDataDto, PaginationDto, ApiProperty, QueryTreatmentDto, ApiPropertyOptional, IsNumber, IsOptional, IsString (+1 more)

### Community 12 - "scripts"
Cohesion: 0.08
Nodes (26): scripts, build, build:client, clean:generated, clean:generated-windows, deploy:client, deploy:client-windows, format (+18 more)

### Community 13 - "treatments.module.ts"
Cohesion: 0.20
Nodes (10): @nestjs/typeorm, RepositoriesModule, Module, src_repositories_treatment_options_entities_index_treatmentoption, TreatmentOptionsModule, Module, TreatmentsModule, Module (+2 more)

### Community 14 - "treatments.service.ts"
Cohesion: 0.17
Nodes (9): src_repositories_treatments_dto_index_calculatetreatmentdto, src_repositories_treatments_dto_index_querytreatmentdto, src_repositories_treatments_dto_index_treatmentcalculationsdto, TreatmentCalculationsDto, ApiProperty, UpdateTreatmentDto, CalculateTreatmentValidationPipe, Injectable (+1 more)

### Community 15 - "additionalProperties"
Cohesion: 0.08
Nodes (23): apiModulePrefix, basePath, configurationPrefix, enumPropertyNaming, fileNaming, generatePublicApi, modelPropertyNaming, npmName (+15 more)

### Community 16 - "ThermalTreatmentInput"
Cohesion: 0.23
Nodes (11): ReportsController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body, Controller, Post (+3 more)

### Community 17 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, eslint, eslint-config-prettier, eslint-plugin-prettier, jest, @nestjs/cli, @nestjs/schematics, @nestjs/testing (+15 more)

### Community 18 - "app.module.ts"
Cohesion: 0.14
Nodes (10): @nestjs/serve-static, AppController, Body, Controller, Get, Post, AppService, Injectable (+2 more)

### Community 19 - "@nestjs/swagger"
Cohesion: 0.34
Nodes (3): class-transformer, class-validator, @nestjs/swagger

### Community 20 - "evaluations.service.ts"
Cohesion: 0.18
Nodes (8): EvaluationTemplateResponseDto, ApiProperty, src_repositories_evaluations_dto_index_createevaluationcriteriadto, src_repositories_evaluations_dto_index_createevaluationdto, src_repositories_evaluations_dto_index_createexternaltreatmentdto, src_repositories_evaluations_dto_index_queryevaluationdto, src_repositories_evaluations_dto_index_updateevaluationdto, UpdateEvaluationDto

### Community 21 - "User"
Cohesion: 0.05
Nodes (51): ApiBearerAuth, BeforeInsert, CurrentUser, CreateSampleEvaluations1751337651990, EvaluationsController, ApiOperation, ApiResponse, ApiTags (+43 more)

### Community 22 - "typeorm"
Cohesion: 0.19
Nodes (14): typeorm, IdEntity, ApiProperty, Column, CreateDateColumn, PrimaryGeneratedColumn, src_repositories_base_index_identity, EvaluationTemplate (+6 more)

### Community 23 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, experimentalDecorators, forceConsistentCasingInFileNames, incremental (+11 more)

### Community 24 - "README.md"
Cohesion: 0.05
Nodes (37): Configuración, Construcción Completa del Cliente, Despliegue Completo (Linux/macOS), Despliegue Completo (Windows), Despliegue del Cliente (Linux/macOS), Despliegue del Cliente (Windows), Estructura de Archivos Generados, Flujo de Trabajo Recomendado (+29 more)

### Community 25 - "BaseResponseDto"
Cohesion: 0.12
Nodes (13): IsDate, BaseResponseDto, ApiProperty, IsBoolean, IsNotEmpty, IsNumber, IsOptional, Type (+5 more)

### Community 26 - "treatment-options.service.ts"
Cohesion: 0.21
Nodes (7): @nestjs/testing, src_repositories_treatment_options_dto_index_createtreatmentoptiondto, src_repositories_treatment_options_dto_index_treatmentoptionlistdto, src_repositories_treatment_options_dto_index_treatmentoptionresponsedto, src_repositories_treatment_options_dto_index_updatetreatmentoptiondto, UpdateTreatmentOptionDto, ALLOWED_SORT

### Community 27 - "test.service.ts"
Cohesion: 0.31
Nodes (6): src_repositories_test_dto_index_createtestdto, src_repositories_test_dto_index_testresponsedto, src_repositories_test_dto_index_updatetestdto, src_repositories_test_entities_index_test, TestModule, Module

### Community 28 - "evaluation-response.dto.ts"
Cohesion: 0.16
Nodes (10): EvaluationCriteriaResponseDto, ApiProperty, ApiPropertyOptional, EvaluationResponseDto, ApiProperty, ApiPropertyOptional, ExternalTreatmentResponseDto, ApiProperty (+2 more)

### Community 29 - "TestController"
Cohesion: 0.13
Nodes (15): TestController, ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam (+7 more)

### Community 30 - "main.ts"
Cohesion: 0.15
Nodes (9): Catch, cookie-parser, csurf, helmet, JwtAuthGuard, Injectable, HttpExceptionFilter, SENSITIVE_KEYS (+1 more)

### Community 31 - "AuthService"
Cohesion: 0.18
Nodes (5): AuthService, Injectable, InjectRepository, LogoutResponseDto, ApiProperty

### Community 32 - "CreateExternalTreatmentDto"
Cohesion: 0.20
Nodes (10): CreateExternalTreatmentDto, ApiProperty, ApiPropertyOptional, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 33 - "CreateEvaluationDto"
Cohesion: 0.15
Nodes (13): ArrayMinSize, IsArray, CreateEvaluationDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsDateString, IsEnum (+5 more)

### Community 34 - ".calculateThermalResults"
Cohesion: 0.29
Nodes (8): ThermalCalculationsController, ApiBody, ApiOperation, ApiResponse, ApiTags, Body, Controller, Post

### Community 35 - ".login"
Cohesion: 0.27
Nodes (10): ApiCookieAuth, Req, Res, ApiBody, ApiOperation, ApiResponse, Body, Post (+2 more)

### Community 36 - "CreateEvaluationCriteriaDto"
Cohesion: 0.17
Nodes (12): CreateEvaluationCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional (+4 more)

### Community 37 - "4. Fórmulas de Flujos y Caudales"
Cohesion: 0.20
Nodes (10): 4.1 Caudal de Agua (Ecuación 1.6), 4.2 Caudal de Crudo Seco (Ecuación 1.7), 4.3 Porcentaje de Agua Libre y Sedimento (Ecuación 1.26), 4.4 Porcentaje de Agua Emulsionada, 4.5 Caudal de Agua Libre Entrando (Ecuación 1.26 / Ec. 35), 4.6 Caudal de Agua Emulsionada Entrando (Ecuación 1.27 / Ec. 36), 4.7 Cantidad de Agua Total a Ser Manejada (Ecuación 1.28 / Ec. 37), 4.8 Fracción Volumétrica del Agua (Ecuación 1.29 / Ec. 38) (+2 more)

### Community 38 - "auth.controller.ts"
Cohesion: 0.18
Nodes (9): AuthController, ApiTags, Controller, src_auth_dto_index_logindto, src_auth_dto_index_loginresponsedto, src_auth_dto_index_logoutresponsedto, src_auth_dto_index_registerdto, src_auth_dto_index_registerresponsedto (+1 more)

### Community 39 - "auth/dto/index.ts"
Cohesion: 0.35
Nodes (7): AuthResponseDto, ApiProperty, LoginResponseDto, ApiProperty, UserDataDto, RegisterResponseDto, ApiProperty

### Community 40 - "DaysOfWeek"
Cohesion: 0.20
Nodes (8): DaysOfWeek, FRIDAY, MONDAY, SATURDAY, SUNDAY, THURSDAY, TUESDAY, WEDNESDAY

### Community 41 - "CreateTemplateCriteriaDto"
Cohesion: 0.20
Nodes (10): CreateTemplateCriteriaDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString (+2 more)

### Community 42 - "TestResponseDto"
Cohesion: 0.16
Nodes (9): TestResponseDto, ApiProperty, IsNotEmpty, IsString, UpdateTestDto, Body, Param, TestService (+1 more)

### Community 43 - "CreateTreatmentDto"
Cohesion: 0.15
Nodes (14): CreateTreatmentDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max (+6 more)

### Community 44 - "5. Fórmulas de Áreas y Volúmenes"
Cohesion: 0.22
Nodes (9): 5.1 Área Total del Recipiente (Ecuación 1.10), 5.2 Área desde el Fondo al Nivel Bajo Bajo de Agua (Ecuación 1.9), 5.3 Área Ocupada por el Agua (Ecuación 1.17 / Ec. 26), 5.4 Área Ocupada por el Crudo (Ecuación 1.4 / Ec. 13), 5.5 Área Disponible para el Gas (Ecuación 1.11), 5.6 Área Requerida para el Gas (Ecuación 1.15 / Ec. 25), 5.7 Volumen de Retención del Crudo (Ecuación 1.5), 5.8 Volumen de Retención del Agua (Ecuación 1.12) (+1 more)

### Community 45 - "jest"
Cohesion: 0.22
Nodes (9): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+1 more)

### Community 46 - "RegisterDto"
Cohesion: 0.33
Nodes (5): RegisterDto, IsEmail, IsNotEmpty, IsString, MinLength

### Community 47 - "CreateTestDto"
Cohesion: 0.18
Nodes (11): BaseEntityDto, ApiPropertyOptional, IsBoolean, IsNumber, IsOptional, src_repositories_base_index_baseentitydto, CreateTestDto, ApiProperty (+3 more)

### Community 48 - "guards/index.ts"
Cohesion: 0.33
Nodes (3): AdminGuard, Injectable, src_repositories_users_entities_index_userrole

### Community 49 - "LoginDto"
Cohesion: 0.40
Nodes (4): LoginDto, IsEmail, IsNotEmpty, IsString

### Community 50 - "Fórmulas Implementadas en el Sistema Termo-Lab"
Cohesion: 0.33
Nodes (6): Backend (termo-lab-api), Fórmulas Implementadas en el Sistema Termo-Lab, 📝 Notas Importantes, 🔍 Referencias, 📊 Resumen de Archivos, 📋 Índice

### Community 51 - "7. Fórmulas de Decantación"
Cohesion: 0.29
Nodes (7): 7.1 Velocidad de Decantación de la Fase Pesada (Ecuación 1.22), 7.2 Tiempo de Decantación de la Fase Pesada (Ecuación 1.23), 7.3 Tiempo de Decantación de la Fase Liviana (Ecuación 1.24 / Ec. 33), 7.4 Porcentaje de Deshidratación del Equipo (Ecuación 1.19 / Ec. 28), 7.5 Cantidad de Agua Saliendo con el Crudo (Ecuación 1.18 / Ec. 27), 7.6 Corte de Agua del Crudo Saliendo (Ecuación 1.13 / Ec. 23), 7. Fórmulas de Decantación

### Community 52 - "jwt-auth.guard.ts"
Cohesion: 0.17
Nodes (8): ref_fs, @nestjs/core, @nestjs/passport, ref_path, supertest, AppModule, Module, IS_PUBLIC_KEY

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
Cohesion: 0.33
Nodes (6): EvaluationTemplateCriteria, ApiProperty, ApiPropertyOptional, Column, Entity, ManyToOne

### Community 58 - "TreatmentOptionService"
Cohesion: 0.18
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

### Community 73 - "id.create.ts"
Cohesion: 0.40
Nodes (4): IdCreateEntity, ApiProperty, IsNotEmpty, IsNumber

### Community 74 - "@nestjs/common"
Cohesion: 0.20
Nodes (8): @nestjs/common, CalculationCriteria, ComparisonOperator, EvaluationCalculationResult, ApiProperty, EvaluationReportData, ThermalCalculationResults, ApiProperty

### Community 75 - "EvaluationType"
Cohesion: 0.67
Nodes (3): EvaluationType, EXTERNAL, INTERNAL

### Community 76 - "user-response.dto.ts"
Cohesion: 0.14
Nodes (7): bcrypt, SeedAdminAndOperatorUsers1751178224375, UpdateUserPasswords1759794383734, src_repositories_users_entities_index_user, UserRole, ADMIN, OPERATOR

### Community 81 - "evaluations.module.ts"
Cohesion: 0.11
Nodes (16): CreateEvaluationTemplates1751337696278, ExternalTreatment, ApiProperty, ApiPropertyOptional, Column, Entity, src_repositories_evaluations_entities_index_evaluationcriteria, src_repositories_evaluations_entities_index_evaluationtemplate (+8 more)

### Community 86 - "QueryBaseDto"
Cohesion: 0.22
Nodes (8): QueryBaseDto, ApiPropertyOptional, IsIn, IsNumber, IsOptional, IsString, Type, Query

### Community 89 - "Test"
Cohesion: 0.22
Nodes (5): Test, ApiProperty, Column, Entity, InjectRepository

### Community 90 - "CreateTreatmentOptionDto"
Cohesion: 0.22
Nodes (9): CreateTreatmentOptionDto, ApiProperty, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max (+1 more)

### Community 92 - "QueryEvaluationDto"
Cohesion: 0.25
Nodes (8): QueryEvaluationDto, ApiPropertyOptional, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Type

## Knowledge Gaps
- **297 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 639 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `auth.service.ts`, `devices.service.ts`, `auth.controller.ts`, `package.json`, `users.service.ts`, `treatments.module.ts`, `treatments.service.ts`, `guards/index.ts`, `evaluations.module.ts`, `app.module.ts`, `jwt-auth.guard.ts`, `User`, `evaluations.service.ts`, `treatment-options.service.ts`, `test.service.ts`, `main.ts`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Why does `@nestjs/swagger` connect `@nestjs/swagger` to `UserResponseDto`, `devices.service.ts`, `package.json`, `users.service.ts`, `PaginationDto`, `treatments.service.ts`, `evaluations.service.ts`, `typeorm`, `BaseResponseDto`, `treatment-options.service.ts`, `test.service.ts`, `evaluation-response.dto.ts`, `main.ts`, `AuthService`, `auth.controller.ts`, `auth/dto/index.ts`, `CreateTestDto`, `jwt-auth.guard.ts`, `id.create.ts`, `@nestjs/common`, `user-response.dto.ts`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `typeorm` connect `typeorm` to `auth.service.ts`, `devices.service.ts`, `CreateUnaccentExtension1752379896329`, `package.json`, `AddThermalCalculationFields1759797734044`, `AddThermalCalculationsToEvaluations1763061460756`, `AddTemplateIdToEvaluations1763061460757`, `users.service.ts`, `user-response.dto.ts`, `treatments.service.ts`, `evaluations.module.ts`, `AddDevices1794006813002`, `evaluations.service.ts`, `SeedTreatmentOptions1751181394026`, `treatment-options.service.ts`, `test.service.ts`, `1751337651500-CreateSampleTreatments.ts`, `data-source.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UserResponseDto` be split into smaller, more focused modules?**
  _Cohesion score 0.06265664160401002 - nodes in this community are weakly interconnected._
- **Should `ThermalCalculatorService` be split into smaller, more focused modules?**
  _Cohesion score 0.07982583454281568 - nodes in this community are weakly interconnected._
- **Should `devices.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0507048180096781 - nodes in this community are weakly interconnected._
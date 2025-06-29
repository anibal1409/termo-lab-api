import { join } from 'path';

import {
  Logger,
  Module,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RepositoriesModule } from './repositories/repositories.module';

@Module({
  imports: [
    // 1. Configuración de variables de entorno (con validación opcional)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configuración de TypeORM con variables de entorno
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        // Verificación explícita de la contraseña
        const password = config.get('DB_PASSWORD');
        if (typeof password !== 'string') {
          throw new Error('Database password must be a string');
        }

        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: +config.get('DB_PORT'),
          username: config.get('DB_USER'),
          password: password, // Aseguramos que es string
          database: config.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          migrationsRun: config.get('NODE_ENV') === 'production',
          synchronize: config.get('NODE_ENV') === 'development',
          logging: config.get('DB_LOGGING') === 'true',
          ssl:
            config.get('DB_SSL') === 'true'
              ? { rejectUnauthorized: false }
              : false,
          extra: { connectionLimit: 10 },
        };
      },
      inject: [ConfigService],
    }),
    // 3. Servir Swagger UI estático (opcional)
    ...(process.env.NODE_ENV === 'development'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'swagger-ui'),
            serveRoot: '/api-docs',
            exclude: ['/api*'], // Evita conflicto con rutas API
          }),
        ]
      : []),

    // 4. Módulos de la aplicación
    AuthModule,
    RepositoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 5. Proveedor global para el logger (opcional)
    {
      provide: 'APP_LOGGER',
      useValue: new Logger('Application'),
    },
  ],
})
export class AppModule {}

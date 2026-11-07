import { join } from 'path';

import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RepositoriesModule } from './repositories/repositories.module';

function validateEnv(config: Record<string, unknown>) {
  const required = [
    'JWT_SECRET',
    'COOKIE_SECRET',
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
  ];
  const missing = required.filter((key) => !config[key]);
  if (missing.length) {
    throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
  }
  if (config.NODE_ENV === 'production' && !config.CORS_ORIGIN) {
    throw new Error('CORS_ORIGIN es obligatorio en producción');
  }
  return config;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const password = config.get('DB_PASSWORD');
        if (typeof password !== 'string') {
          throw new Error('Database password must be a string');
        }

        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: +config.get('DB_PORT'),
          username: config.get('DB_USER'),
          password,
          database: config.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          migrationsRun: config.get('NODE_ENV') === 'production',
          synchronize: config.get('NODE_ENV') === 'development',
          logging: config.get('DB_LOGGING') === 'true',
          ssl:
            config.get('DB_SSL') === 'true'
              ? {
                  rejectUnauthorized:
                    config.get('DB_SSL_REJECT_UNAUTHORIZED') !== 'false',
                }
              : false,
          extra: { connectionLimit: 10 },
        };
      },
      inject: [ConfigService],
    }),
    ...(process.env.NODE_ENV === 'development'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'swagger-ui'),
            serveRoot: '/api-docs',
            exclude: ['/api*'],
          }),
        ]
      : []),

    AuthModule,
    RepositoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_LOGGER',
      useValue: new Logger('Application'),
    },
  ],
})
export class AppModule {}

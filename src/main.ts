import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';

import {
  ConsoleLogger,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import {
  NestFactory,
  Reflector,
} from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      json: true,
    }),
  });

  // 1. Configuración de Cookies
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // 2. Configuración CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(' ') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Protección CSRF (opcional)
  if (process.env.CSRF_ENABLED === 'true') {
    app.use(
      csurf({
        cookie: {
          secure: process.env.SECURE_COOKIE === 'true',
          httpOnly: true,
        },
      }),
    );
  }

  // 4. Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('TermoLab API Documentation')
    .setDescription('API para diseño y evaluación de tratamientos térmicos')
    .setVersion('1.0')
    .addTag('api')
    .addCookieAuth('access_token') // Añadir soporte para cookies
    .addBearerAuth() // Añadir soporte para JWT en headers
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(`/api-docs`, (req, res, next) => {
      const auth = { login: 'admin', password: 'swagger-secret' };
      const [username, password] = Buffer.from(
        req.headers.authorization?.split(' ')[1] || '',
        'base64',
      )
        .toString()
        .split(':');

      if (username === auth.login && password === auth.password) {
        return next();
      }
      res.set('WWW-Authenticate', 'Basic realm="Swagger"');
      res.status(401).send('Authentication required');
    });
  }

  // 5. Configuración global
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // 6. Configuración de seguridad global
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // 7. Iniciar aplicación
  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(`📄 Swagger docs available at: http://localhost:${port}/api-docs`);
}

bootstrap();

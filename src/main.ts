import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import helmet from 'helmet';

import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      json: true,
    }),
  });

  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));

  const corsOrigin = process.env.CORS_ORIGIN?.split(' ').filter(Boolean);
  app.enableCors({
    origin: corsOrigin?.length ? corsOrigin : false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

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

  const config = new DocumentBuilder()
    .setTitle('TermoLab API Documentation')
    .setDescription('API para diseño y evaluación de tratamientos térmicos')
    .setVersion('1.0')
    .addTag('api')
    .addCookieAuth('access_token')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  if (process.env.NODE_ENV === 'production') {
    const swaggerUser = process.env.SWAGGER_USER || 'admin';
    const swaggerPassword = process.env.SWAGGER_PASSWORD;
    if (!swaggerPassword) {
      throw new Error('SWAGGER_PASSWORD es obligatorio en producción');
    }
    app.use(`/api-docs`, (req, res, next) => {
      const [username, password] = Buffer.from(
        req.headers.authorization?.split(' ')[1] || '',
        'base64',
      )
        .toString()
        .split(':');

      if (username === swaggerUser && password === swaggerPassword) {
        return next();
      }
      res.set('WWW-Authenticate', 'Basic realm="Swagger"');
      res.status(401).send('Authentication required');
    });
  }

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(`📄 Swagger docs available at: http://localhost:${port}/api-docs`);
}

bootstrap();

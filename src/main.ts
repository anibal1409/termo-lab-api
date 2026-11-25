import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { timingSafeEqual } from 'crypto';

import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/** Comparación en tiempo constante (evita ataques de temporización). */
function safeEqual(a = '', b = ''): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

/** En producción no se arranca con secretos débiles o configuración insegura. */
function assertProductionConfig(): void {
  if (process.env.NODE_ENV !== 'production') return;
  const errors: string[] = [];
  for (const key of ['JWT_SECRET', 'COOKIE_SECRET']) {
    if ((process.env[key] ?? '').length < 32) {
      errors.push(`${key} debe tener al menos 32 caracteres`);
    }
  }
  if (!process.env.CORS_ORIGIN) errors.push('CORS_ORIGIN es obligatorio');
  if (!process.env.SMTP_HOST) errors.push('SMTP_HOST es obligatorio');
  if (!process.env.FRONTEND_URL?.startsWith('https://')) {
    errors.push('FRONTEND_URL debe ser https://');
  }
  if (process.env.SECURE_COOKIE !== 'true') {
    errors.push('SECURE_COOKIE debe ser true');
  }
  if (process.env.DB_SYNCHRONIZE === 'true') {
    errors.push('DB_SYNCHRONIZE no puede ser true');
  }
  if (errors.length) {
    throw new Error(`Configuración insegura: ${errors.join('; ')}`);
  }
}

/**
 * Límite de intentos por IP en endpoints de autenticación (fuerza bruta).
 * ponytail: memoria de un solo proceso; con varias instancias usar Redis/@nestjs/throttler.
 */
function authRateLimit(maxAttempts = 10, windowMs = 15 * 60_000) {
  const hits = new Map<string, { count: number; reset: number }>();
  return (req: any, res: any, next: () => void) => {
    const now = Date.now();
    const key = req.ip;
    let entry = hits.get(key);
    if (!entry || entry.reset <= now) {
      entry = { count: 0, reset: now + windowMs };
      hits.set(key, entry);
      if (hits.size > 10_000) {
        for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
      }
    }
    if (++entry.count > maxAttempts) {
      res.set('Retry-After', Math.ceil((entry.reset - now) / 1000));
      return res.status(429).json({
        statusCode: 429,
        message: 'Demasiados intentos, intente más tarde',
      });
    }
    next();
  };
}

async function bootstrap() {
  assertProductionConfig();

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      json: true,
    }),
    bodyParser: false, // se registra abajo con límite y manejo de errores propios
  });

  app.use(helmet());
  // 5 MB: series del gemelo térmico (hasta 100k puntos); el resto es mucho menor
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  // JSON mal formado / body muy grande → 400/413 (si no, cae a otros handlers)
  app.use((err: any, req: any, res: any, next: (e?: any) => void) => {
    if (err?.type && err.status >= 400 && err.status < 500) {
      return res.status(err.status).json({
        statusCode: err.status,
        error:
          err.type === 'entity.too.large' ? 'Payload Too Large' : 'Bad Request',
        message:
          err.type === 'entity.too.large'
            ? 'Cuerpo demasiado grande'
            : 'JSON inválido',
        path: req.url,
      });
    }
    next(err);
  });
  // Detrás de un proxy (nginx), req.ip debe ser la IP real del cliente
  if (process.env.TRUST_PROXY) {
    app
      .getHttpAdapter()
      .getInstance()
      // '1' = nº de saltos (número); 'loopback' o IPs/subredes = texto
      .set(
        'trust proxy',
        /^\d+$/.test(process.env.TRUST_PROXY)
          ? Number(process.env.TRUST_PROXY)
          : process.env.TRUST_PROXY,
      );
  }
  const limiter = authRateLimit();
  for (const path of ['login', 'register', 'face-login', 'set-password']) {
    app.use(`/api/auth/${path}`, limiter);
  }
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

  if (process.env.NODE_ENV === 'production') {
    const swaggerUser = process.env.SWAGGER_USER || 'admin';
    const swaggerPassword = process.env.SWAGGER_PASSWORD;
    if (!swaggerPassword) {
      throw new Error('SWAGGER_PASSWORD es obligatorio en producción');
    }
    app.use(`/api-docs`, (req, res, next) => {
      const decoded = Buffer.from(
        req.headers.authorization?.split(' ')[1] || '',
        'base64',
      ).toString();
      // La contraseña puede contener ':'; solo el primero separa usuario
      const sep = decoded.indexOf(':');
      const username = sep < 0 ? '' : decoded.slice(0, sep);
      const password = sep < 0 ? '' : decoded.slice(sep + 1);

      if (
        safeEqual(username, swaggerUser) &&
        safeEqual(password, swaggerPassword)
      ) {
        return next();
      }
      res.set('WWW-Authenticate', 'Basic realm="Swagger"');
      res.status(401).send('Authentication required');
    });
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

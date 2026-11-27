# Despliegue en Railway

Arquitectura: **Postgres** + **API Nest** (`termo-lab-api`) + **Web** Angular/nginx (`termo-lab-app`). El navegador solo habla con el Web; nginx hace proxy de `/api` y `/api-docs` a la API por red privada.

```text
Usuario → Web (nginx, público) → /api → API (Nest, privado) → Postgres
```

## Requisitos

- Cuenta en [Railway](https://railway.com/)
- Repos GitHub: `termo-lab-api` (rama `main`) y `termo-lab-app` (rama `master`)
- Secretos ≥ 32 caracteres para JWT/COOKIE; passwords de seed ≥ 12

## 1. Proyecto y Postgres

1. New Project → **Empty Project**.
2. **Add Service** → **Database** → **PostgreSQL**.
3. Anota el nombre del servicio (p. ej. `Postgres`).

## 2. Servicio API

1. **Add Service** → **GitHub Repo** → `termo-lab-api`, rama `main`.
2. Settings → usa `railway.json` del repo (build `npm ci && npm run build`, start `npm run start:prod`, health `/api/health`).
3. Variables (Variables tab). Usa referencias Railway:

| Variable | Valor sugerido |
|----------|----------------|
| `NODE_ENV` | `production` |
| `TRUST_PROXY` | `1` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `DB_SSL` | `true` |
| `DB_SSL_REJECT_UNAUTHORIZED` | `false` |
| `DB_SYNCHRONIZE` | `false` |
| `JWT_SECRET` | *(openssl rand -base64 48)* |
| `COOKIE_SECRET` | *(openssl rand -base64 48)* |
| `SECURE_COOKIE` | `true` |
| `JWT_EXPIRES_IN` | `3600` |
| `CORS_ORIGIN` | `https://<url-del-web>` *(después del paso 3)* |
| `FRONTEND_URL` | `https://<url-del-web>` |
| `SMTP_OPTIONAL` | `true` *(primer deploy; luego SMTP real)* |
| `SWAGGER_USER` | `admin` |
| `SWAGGER_PASSWORD` | *(secreto fuerte)* |
| `SEED_ADMIN_PASSWORD` | *(≥12 chars)* |
| `SEED_OPERATOR_PASSWORD` | *(≥12 chars)* |
| `REGISTER_ENABLED` | `false` |
| `CSRF_ENABLED` | `false` |
| `FACE_LOGIN_ENABLED` | `false` |

Plantilla completa: [`.env.railway.example`](../.env.railway.example).

4. **No** generes dominio público para la API (opcional). El healthcheck de Railway llega a la API por la red interna del servicio.

Al arrancar en `NODE_ENV=production`, TypeORM ejecuta migraciones (`migrationsRun`).

### serialport

La dependencia nativa `serialport` (piloto USB) se compila en el build. En Railway no hay USB; el módulo puede cargar igual. Si el build falla por node-gyp, añade en el servicio las build deps que indique el log (python3, make, g++) o contacta soporte Railpack.

## 3. Servicio Web

1. **Add Service** → GitHub → `termo-lab-app`, rama `master`.
2. Builder: **Dockerfile** (`railway.json` del front).
3. Variables:

| Variable | Valor |
|----------|--------|
| `API_HOST` | `${{termo-lab-api.RAILWAY_PRIVATE_DOMAIN}}` |
| `API_PORT` | `${{termo-lab-api.PORT}}` |

(`PORT` del contenedor nginx lo asigna Railway.)

4. **Settings → Networking → Generate Domain** en el servicio **Web** (esta es la URL pública).
5. Copia la URL `https://….up.railway.app` y actualiza en la API:
   - `FRONTEND_URL`
   - `CORS_ORIGIN`  
   (mismo valor; sin barra final).

6. Redeploy API si hace falta tras cambiar esas vars.

## 4. Verificación

1. `https://<web>/api/health` → `{"status":"ok"}`.
2. Abrir la app, login con el admin sembrado (`SEED_ADMIN_PASSWORD`).
3. Swagger: `https://<web>/api-docs` (Basic Auth).
4. Sin SMTP: los enlaces de “definir contraseña” salen en los **logs** de la API. Cuando tengas correo, configura `SMTP_*` y quita `SMTP_OPTIONAL`.

## 5. SMTP (después del primer deploy)

```text
SMTP_OPTIONAL=   (borrar o false)
SMTP_HOST=…
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=…
SMTP_PASS=…
SMTP_FROM="TermoLab <no-reply@tudominio.com>"
```

## Notas

- Cookies `sameSite=strict` + `api: '/api'` en el front de producción: mismo origen vía nginx; no uses dos dominios públicos distintos sin cambiar auth.
- `applyDatabaseEnv` mapea `DATABASE_URL` / `PG*` → `DB_*` al arrancar ([`src/common/config/apply-database-url.ts`](../src/common/config/apply-database-url.ts)).
- Presupuesto: 3 servicios (Web + API + Postgres) en un mismo proyecto Railway.

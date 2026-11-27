/**
 * Rellena DB_* desde DATABASE_URL (Railway Postgres) o variables PG*.
 * Debe ejecutarse antes de validateEnv / TypeORM.
 */
export function applyDatabaseEnv(
  env: NodeJS.ProcessEnv = process.env,
): void {
  if (env.DATABASE_URL && (!env.DB_HOST || !env.DB_PASSWORD)) {
    try {
      const u = new URL(env.DATABASE_URL);
      env.DB_HOST ||= u.hostname;
      env.DB_PORT ||= u.port || '5432';
      env.DB_USER ||= decodeURIComponent(u.username);
      env.DB_PASSWORD ||= decodeURIComponent(u.password);
      const db = u.pathname.replace(/^\//, '').split('?')[0];
      if (db) env.DB_NAME ||= db;
      const sslmode = u.searchParams.get('sslmode');
      if (
        sslmode &&
        sslmode !== 'disable' &&
        env.DB_SSL !== 'false'
      ) {
        env.DB_SSL ||= 'true';
      }
    } catch {
      throw new Error('DATABASE_URL no es una URL válida');
    }
  }

  // Solo si PG* existe: asignar undefined a process.env escribe el texto "undefined"
  const fallback: [string, string][] = [
    ['DB_HOST', 'PGHOST'],
    ['DB_PORT', 'PGPORT'],
    ['DB_USER', 'PGUSER'],
    ['DB_PASSWORD', 'PGPASSWORD'],
    ['DB_NAME', 'PGDATABASE'],
  ];
  for (const [db, pg] of fallback) {
    if (!env[db] && env[pg]) env[db] = env[pg];
  }

  // Certificados gestionados de Railway: no exigir CA local.
  if (env.DB_SSL === 'true' && env.DB_SSL_REJECT_UNAUTHORIZED == null) {
    env.DB_SSL_REJECT_UNAUTHORIZED = 'false';
  }
}

import { applyDatabaseEnv } from './apply-database-url';

describe('applyDatabaseEnv', () => {
  it('mapea DATABASE_URL a DB_*', () => {
    const env: NodeJS.ProcessEnv = {
      DATABASE_URL:
        'postgresql://u%40ser:p%40ss@db.example:6543/termo?sslmode=require',
    };
    applyDatabaseEnv(env);
    expect(env.DB_HOST).toBe('db.example');
    expect(env.DB_PORT).toBe('6543');
    expect(env.DB_USER).toBe('u@ser');
    expect(env.DB_PASSWORD).toBe('p@ss');
    expect(env.DB_NAME).toBe('termo');
    expect(env.DB_SSL).toBe('true');
    expect(env.DB_SSL_REJECT_UNAUTHORIZED).toBe('false');
  });

  it('usa PG* si no hay DB_*', () => {
    const env: NodeJS.ProcessEnv = {
      PGHOST: 'pghost',
      PGPORT: '5432',
      PGUSER: 'pguser',
      PGPASSWORD: 'pgpass',
      PGDATABASE: 'pgdb',
    };
    applyDatabaseEnv(env);
    expect(env.DB_HOST).toBe('pghost');
    expect(env.DB_NAME).toBe('pgdb');
  });
});

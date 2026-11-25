/**
 * Contraseña de los usuarios semilla. En producción es obligatoria por variable
 * de entorno (≥ 12 caracteres); en local cae a '12345678' para desarrollo.
 */
export function seedPassword(role: 'admin' | 'operator'): string {
  const key =
    role === 'admin' ? 'SEED_ADMIN_PASSWORD' : 'SEED_OPERATOR_PASSWORD';
  const value = process.env[key];
  if (process.env.NODE_ENV === 'production') {
    if (!value || value.length < 12 || value === '12345678') {
      throw new Error(
        `${key} es obligatorio en producción (mínimo 12 caracteres)`,
      );
    }
    return value;
  }
  return value || '12345678';
}

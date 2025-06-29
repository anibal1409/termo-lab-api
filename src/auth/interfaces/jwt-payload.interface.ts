// src/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
  jti?: string; // JWT ID (identificador único del token)
  id: number;
  email: string;
  role: string;
  exp?: number; // Tiempo de expiración
  iat?: number; // Fecha de emisión
}

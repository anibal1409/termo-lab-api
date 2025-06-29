import { Request } from 'express';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // Extraer token de cookies o header Authorization
          return (
            req?.cookies?.access_token ||
            ExtractJwt.fromAuthHeaderAsBearerToken()(req)
          );
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Verificar si el token tiene jti
    if (!payload.jti) {
      throw new UnauthorizedException('Token inválido');
    }

    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException('Token expirado o inválido');
    }

    return { ...user, accessToken: payload.jti };
  }
}

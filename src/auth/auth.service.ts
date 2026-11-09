import { Request, Response } from 'express';
import { IsNull, Not, Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserRole } from '../repositories/users/entities';
import {
  LoginResponseDto,
  LogoutResponseDto,
  RegisterResponseDto,
} from './dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { FaceLoginDto, EnrollFaceDto } from './dto/face-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly invalidatedTokens = new Set<string>();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerDto: RegisterDto,
    res?: Response,
  ): Promise<RegisterResponseDto> {
    const registerEnabled =
      this.configService.get('REGISTER_ENABLED') === 'true' ||
      (this.configService.get('NODE_ENV') !== 'production' &&
        this.configService.get('REGISTER_ENABLED') !== 'false');
    if (!registerEnabled) {
      throw new ForbiddenException('Registro público deshabilitado');
    }

    const { email, password, name } = registerDto;

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new UnauthorizedException('Email already exists');
    }

    const user = this.userRepository.create({
      email,
      name,
      password, // plain: User.@BeforeInsert hashea una sola vez
      role: UserRole.OPERATOR,
      birthDate: new Date(),
    });

    await this.userRepository.save(user);
    const { expiresIn, expiresAt } = this.generateToken(user);

    if (res) {
      const { accessToken } = this.generateToken(user);
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: expiresIn * 1000,
      });
    }

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      expiresAt: expiresAt.toISOString(),
    };
  }

  async login(loginDto: LoginDto, res?: Response): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, expiresIn, expiresAt } = this.generateToken(user);

    // Enviar token como cookie HTTP-only (si se proporciona 'res')
    if (res) {
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expiresIn * 1000, // Tiempo en milisegundos
      });
    }

    return {
      success: true,
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      expiresAt: expiresAt.toISOString(),
    };
  }

  async invalidateToken(token: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token) as JwtPayload;
      if (payload.jti) {
        this.invalidatedTokens.add(payload.jti);

        // Programar eliminación después del tiempo de expiración
        if (payload.exp) {
          const expirationTime = payload.exp * 1000 - Date.now();
          setTimeout(() => {
            this.invalidatedTokens.delete(payload.jti);
          }, expirationTime);
        }
      }
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    // Verificar si el token está invalidado
    if (payload.jti && this.invalidatedTokens.has(payload.jti)) {
      throw new UnauthorizedException('Token invalidado');
    }

    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }

  private generateToken(user: User): {
    accessToken: string;
    expiresIn: number;
    expiresAt: Date;
  } {
    const expiresIn = parseInt(
      this.configService.get('JWT_EXPIRES_IN', '3600'),
    );
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    const payload: JwtPayload = {
      jti:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      id: user.id,
      email: user.email,
      role: user.role,
      // Elimina la propiedad 'exp' del payload
    };

    return {
      accessToken: this.jwtService.sign(payload, { expiresIn }), // Configura expiración aquí
      expiresIn,
      expiresAt,
    };
  }

  async faceLogin(
    dto: FaceLoginDto,
    res?: Response,
  ): Promise<LoginResponseDto> {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'role', 'faceEmbedding'],
      where: { faceEmbedding: Not(IsNull()) },
    });

    let best: User | null = null;
    let bestDist = Infinity;
    for (const u of users) {
      const d = Math.sqrt(
        dto.embedding.reduce((s, v, i) => s + (v - u.faceEmbedding[i]) ** 2, 0),
      );
      if (d < bestDist) {
        bestDist = d;
        best = u;
      }
    }

    if (!best || bestDist > 0.6) {
      throw new UnauthorizedException('Rostro no reconocido');
    }

    const { accessToken, expiresIn, expiresAt } = this.generateToken(best);

    if (res) {
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: 'strict',
        maxAge: expiresIn * 1000,
      });
    }

    return {
      success: true,
      message: 'Login facial exitoso',
      accessToken,
      user: {
        id: best.id,
        name: best.name,
        email: best.email,
        role: best.role,
      },
      expiresAt: expiresAt.toISOString(),
    };
  }

  async enrollFace(
    userId: number,
    dto: EnrollFaceDto,
  ): Promise<{ success: boolean }> {
    await this.userRepository.update(userId, { faceEmbedding: dto.embedding });
    return { success: true };
  }

  async unenrollFace(userId: number): Promise<{ success: boolean }> {
    await this.userRepository.update(userId, { faceEmbedding: null });
    return { success: true };
  }

  async hasFace(userId: number): Promise<{ enrolled: boolean }> {
    const user = await this.userRepository.findOne({
      select: ['id', 'faceEmbedding'],
      where: { id: userId },
    });
    return { enrolled: !!user?.faceEmbedding };
  }

  async logout(req: Request, res: Response): Promise<LogoutResponseDto> {
    // Obtener el token del header o cookies
    const token =
      req.cookies?.access_token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (token) {
      await this.invalidateToken(token);
      res.clearCookie('access_token');
    }

    return {
      success: true,
      message: 'Sesión cerrada exitosamente',
    };
  }
}

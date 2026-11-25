import { createHash, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { IsNull, Not, Repository } from 'typeorm';

import {
  BadRequestException,
  ConflictException,
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
import { SetPasswordDto } from './dto/set-password.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

/** Distancia euclídea máxima entre embeddings (estricta frente al 0.6 típico de face-api). */
const FACE_MATCH_THRESHOLD = 0.5;

/** Hash bcrypt de una cadena aleatoria, solo para igualar tiempos de respuesta. */
const DUMMY_HASH = bcrypt.hashSync(randomUUID(), 10);

@Injectable()
export class AuthService {
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
      // Mensaje genérico: no confirma qué emails están registrados
      throw new ConflictException('No se pudo completar el registro');
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
      where: { email, deleted: false },
      select: [
        'id',
        'name',
        'email',
        'password',
        'role',
        'enrollOnFirstLogin',
        'faceEnrolled',
      ],
    });

    if (!user) {
      // Mismo costo bcrypt que con usuario existente: evita enumerar emails por tiempo
      await bcrypt.compare(password, DUMMY_HASH);
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!(await user.comparePassword(password))) {
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
      mustEnrollFace: user.enrollOnFirstLogin && !user.faceEnrolled,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      expiresAt: expiresAt.toISOString(),
    };
  }

  /** Revoca todos los tokens del usuario emitidos hasta ahora (persistente en BD). */
  async invalidateToken(token: string): Promise<void> {
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token) as JwtPayload;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
    await this.userRepository.update(payload.id, {
      tokensValidAfter: new Date(),
    });
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.tokensValidAfter')
      .where('user.id = :id AND user.deleted = false', { id: payload.id })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    // iat está en segundos: se compara al segundo para no rechazar el token del re-login
    const revokedAt = user.tokensValidAfter
      ? Math.floor(user.tokensValidAfter.getTime() / 1000)
      : 0;
    if (!payload.iat || payload.iat < revokedAt) {
      throw new UnauthorizedException('Token invalidado');
    }
    delete user.tokensValidAfter;
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
      jti: randomUUID(), // CSPRNG: Math.random es predecible
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

  /** Define la contraseña con el token de un solo uso enviado por correo. */
  async setPassword(dto: SetPasswordDto): Promise<{ message: string }> {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordTokenExpires')
      .where('user.passwordTokenHash = :tokenHash AND user.deleted = false', {
        tokenHash,
      })
      .getOne();
    // Mismo mensaje para token inexistente, usado o vencido
    if (
      !user ||
      !user.passwordTokenExpires ||
      user.passwordTokenExpires < new Date()
    ) {
      throw new BadRequestException('Enlace inválido o vencido');
    }
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    await this.userRepository.update(user.id, {
      password: await bcrypt.hash(dto.password, rounds),
      passwordTokenHash: null,
      passwordTokenExpires: null,
      tokensValidAfter: new Date(),
    });
    return { message: 'Contraseña definida. Ya puede iniciar sesión.' };
  }

  async faceLogin(
    dto: FaceLoginDto,
    res?: Response,
  ): Promise<LoginResponseDto> {
    // El embedding se calcula en el navegador: cualquiera con una foto del usuario
    // puede generarlo. Sin prueba de vida en servidor, queda tras flag explícito.
    if (this.configService.get('FACE_LOGIN_ENABLED') !== 'true') {
      throw new ForbiddenException('Login facial deshabilitado');
    }
    // Verificación 1:1 contra el usuario indicado (no búsqueda entre todos)
    const best = await this.userRepository.findOne({
      select: ['id', 'name', 'email', 'role', 'faceEmbedding'],
      where: {
        email: dto.email,
        deleted: false,
        faceEmbedding: Not(IsNull()),
        role: Not(UserRole.ADMIN),
      },
    });
    const stored = best?.faceEmbedding;
    const dist =
      stored?.length === dto.embedding.length
        ? Math.sqrt(
            dto.embedding.reduce((s, v, i) => s + (v - stored[i]) ** 2, 0),
          )
        : Infinity;

    if (!best || dist > FACE_MATCH_THRESHOLD) {
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
      mustEnrollFace: false,
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
    await this.userRepository.update(userId, {
      faceEmbedding: dto.embedding,
      faceEnrolled: true,
    });
    return { success: true };
  }

  async unenrollFace(userId: number): Promise<{ success: boolean }> {
    await this.userRepository.update(userId, {
      faceEmbedding: null,
      faceEnrolled: false,
    });
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

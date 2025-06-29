import * as bcrypt from 'bcrypt';
import {
  Request,
  Response,
} from 'express';
import { Repository } from 'typeorm';

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../repositories/users/entities';
import { LogoutResponseDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly invalidatedTokens = new Set<string>();
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const { email, password, ...rest } = registerDto;

    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    return this.generateToken(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
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

  private generateToken(user: User): { accessToken: string } {
    const payload: JwtPayload = {
      jti:
        Math.random().toString(36).substring(2, 15) + // ID único
        Math.random().toString(36).substring(2, 15),
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async logout(req: Request, res: Response): Promise<LogoutResponseDto> {
    // Obtener el token del header o cookies
    const token =
      req.cookies?.access_token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (token) {
      await this.invalidateToken(token);
    }

    return {
      success: true,
      message: 'Sesión cerrada exitosamente',
    };
  }
}

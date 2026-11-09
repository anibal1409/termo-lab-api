import { Request, Response } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
  EnrollFaceDto,
  FaceLoginDto,
  LoginDto,
  LoginResponseDto,
  LogoutResponseDto,
  RegisterDto,
  RegisterResponseDto,
} from './dto';
import { JwtAuthGuard } from './guards';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description:
      'Autentica al usuario y establece una cookie HTTP-only con el JWT',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso (token en cookie)',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto, res);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Crea una nueva cuenta de usuario',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado (token en cookie)',
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El usuario ya existe' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto, res);
  }

  @Public()
  @Post('face-login')
  @ApiOperation({
    summary: 'Login con reconocimiento facial',
    description:
      'Autentica al usuario comparando el embedding facial enviado desde el navegador',
  })
  @ApiBody({ type: FaceLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login facial exitoso',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Rostro no reconocido' })
  async faceLogin(
    @Body() dto: FaceLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    return this.authService.faceLogin(dto, res);
  }

  @Post('enroll-face')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Registrar rostro del usuario autenticado',
    description:
      'Guarda el embedding facial para permitir login por reconocimiento facial',
  })
  @ApiBody({ type: EnrollFaceDto })
  @ApiResponse({ status: 200, description: 'Rostro registrado' })
  async enrollFace(
    @CurrentUser() user: any,
    @Body() dto: EnrollFaceDto,
  ): Promise<{ success: boolean }> {
    return this.authService.enrollFace(user.id, dto);
  }

  @Delete('enroll-face')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar rostro registrado' })
  @ApiResponse({ status: 200, description: 'Rostro eliminado' })
  async unenrollFace(@CurrentUser() user: any): Promise<{ success: boolean }> {
    return this.authService.unenrollFace(user.id);
  }

  @Get('face-status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Consultar si el usuario tiene rostro registrado' })
  @ApiResponse({ status: 200, description: 'Estado de registro facial' })
  async faceStatus(@CurrentUser() user: any): Promise<{ enrolled: boolean }> {
    return this.authService.hasFace(user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Invalida el token JWT y limpia la cookie',
  })
  @ApiCookieAuth('access_token')
  @ApiResponse({
    status: 200,
    description: 'Sesión cerrada exitosamente',
    type: LogoutResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    const result = await this.authService.logout(req, res);
    return result;
  }
}

import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CurrentUser } from '../../auth/decorators';
import { JwtAuthGuard } from '../../auth/guards';
import { User } from './entities';
import { ChangePasswordDto, UpdateProfileDto, UserResponseDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener mi perfil' })
  @ApiOkResponse({ type: UserResponseDto })
  getProfile(@CurrentUser() user: User): Promise<UserResponseDto> {
    return this.usersService.getProfile(user.id);
  }

  @Patch()
  @ApiOperation({
    summary: 'Actualizar mi perfil',
    description:
      'Permite cambiar nombre y fecha de nacimiento. No permite cambiar rol ni email.',
  })
  @ApiBody({ type: UpdateProfileDto })
  @ApiOkResponse({ type: UserResponseDto })
  updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar mi contraseña' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiOkResponse({
    schema: { type: 'object', properties: { message: { type: 'string' } } },
  })
  @ApiUnauthorizedResponse({ description: 'Contraseña actual incorrecta' })
  changePassword(
    @CurrentUser() user: User,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.usersService.changePassword(user.id, dto);
  }
}

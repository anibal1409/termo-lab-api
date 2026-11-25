import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { BaseResponseDto } from '../../base';
import { User, UserRole } from '../entities/user.entity';

/**
 * DTO para la respuesta de usuarios.
 * Hereda campos comunes de BaseResponseDto.
 */
export class UserResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'María González',
  })
  name: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1985-05-15',
  })
  birthDate: Date;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.OPERATOR,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Correo electrónico único',
    example: 'maria.gonzalez@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Fecha del último inicio de sesión',
    example: '2023-10-30T14:30:00Z',
  })
  lastLogin?: Date;

  @ApiPropertyOptional({
    description:
      'Solo en creación/reenvío: si se envió el correo para definir contraseña',
    example: true,
  })
  inviteSent?: boolean;

  @ApiProperty() allowFiretube: boolean;
  @ApiProperty() allowFlightRecorder: boolean;
  @ApiProperty() enrollOnFirstLogin: boolean;
  @ApiProperty({ description: 'Derivado: tiene rostro enrolado' })
  faceEnrolled: boolean;

  constructor(user: User, inviteSent?: boolean) {
    super(user);
    Object.assign(this, {
      name: user?.name || '',
      birthDate: user?.birthDate ? new Date(user?.birthDate) : null,
      role: user?.role || UserRole.OPERATOR,
      email: user?.email || '',
      lastLogin: user?.lastLogin ? new Date(user?.lastLogin) : null,
      allowFiretube: !!user?.allowFiretube,
      allowFlightRecorder: !!user?.allowFlightRecorder,
      enrollOnFirstLogin: user?.enrollOnFirstLogin ?? true,
      faceEnrolled: !!user?.faceEnrolled,
      ...(inviteSent != null ? { inviteSent } : {}),
    });
  }
}

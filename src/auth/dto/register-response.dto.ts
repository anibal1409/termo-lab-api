import { ApiProperty } from '@nestjs/swagger';

import { AuthResponseDto } from './auth-response.dto';
import { UserDataDto } from './login-response.dto';

export class RegisterResponseDto extends AuthResponseDto {
  @ApiProperty({
    type: () => UserDataDto,
    description: 'Datos básicos del usuario registrado',
  })
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Fecha de expiración del token en formato ISO',
  })
  expiresAt: string;
}

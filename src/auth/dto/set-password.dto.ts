import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SetPasswordDto {
  @ApiProperty({ description: 'Token recibido por correo (fragmento #token=)' })
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{43}$/, { message: 'Token inválido' })
  token: string;

  @ApiProperty({ description: 'Nueva contraseña (8 a 128 caracteres)' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(128)
  password: string;
}

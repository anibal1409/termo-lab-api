import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica si el logout fue exitoso',
  })
  success: boolean;

  @ApiProperty({
    example: 'Sesión cerrada exitosamente',
    description: 'Mensaje descriptivo del resultado',
  })
  message: string;
}

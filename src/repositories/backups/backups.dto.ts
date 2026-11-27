import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBackupDto {
  @ApiPropertyOptional({ example: 'Antes de cargar datos de campo' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;
}

export class RestoreBackupDto {
  @ApiProperty({
    description: 'Contraseña del administrador (re-autenticación)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  password: string;

  @ApiProperty({ description: 'Repetir el id del respaldo para confirmar' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  confirm: string;
}

export class BackupDto {
  @ApiProperty({ example: 'termolab-20261126T221500Z-a1b2c3.dump' }) id: string;
  @ApiProperty() createdAt: string;
  @ApiProperty({ enum: ['manual', 'pre-restore'] }) kind:
    | 'manual'
    | 'pre-restore';
  @ApiProperty({ description: 'Bytes' }) size: number;
  @ApiProperty({
    description: 'SHA-256 del archivo (se verifica antes de restaurar)',
  })
  sha256: string;
  @ApiPropertyOptional() createdById?: number;
  @ApiPropertyOptional() createdByEmail?: string;
  @ApiPropertyOptional() note?: string;
}

export class RestoreResultDto {
  @ApiProperty() restored: string;
  @ApiProperty({
    description: 'Respaldo automático tomado justo antes de restaurar',
  })
  safetyBackup: string;
  @ApiProperty({
    type: [String],
    description: 'Migraciones aplicadas tras restaurar',
  })
  migrationsApplied: string[];
}

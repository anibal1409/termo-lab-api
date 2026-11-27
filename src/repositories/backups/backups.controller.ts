import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AdminGuard } from '../../auth/guards';
import { User } from '../users/entities';
import {
  BackupDto,
  CreateBackupDto,
  RestoreBackupDto,
  RestoreResultDto,
} from './backups.dto';
import { BackupsService } from './backups.service';

@ApiTags('Backups')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('backups')
export class BackupsController {
  constructor(private readonly backups: BackupsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar respaldos (más reciente primero)' })
  @ApiOkResponse({ type: [BackupDto] })
  list(): Promise<BackupDto[]> {
    return this.backups.list();
  }

  @Post()
  @ApiOperation({
    summary: 'Crear respaldo de la base de datos',
    description:
      'pg_dump formato custom; excluye la auditoría. Guarda SHA-256 para verificar integridad.',
  })
  @ApiOkResponse({ type: BackupDto })
  @ApiResponse({ status: 409, description: 'Otra operación en curso' })
  @ApiResponse({ status: 503, description: 'pg_dump no disponible o falló' })
  create(
    @Body() dto: CreateBackupDto,
    @CurrentUser() user: User,
  ): Promise<BackupDto> {
    return this.backups.create({ id: user.id, email: user.email }, dto.note);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Metadatos de un respaldo' })
  @ApiOkResponse({ type: BackupDto })
  get(@Param('id') id: string): Promise<BackupDto> {
    return this.backups.get(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Descargar el archivo del respaldo' })
  @ApiProduces('application/octet-stream')
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  async download(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { meta, stream } = await this.backups.open(id);
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${meta.id}"`,
      'Content-Length': String(meta.size),
      'X-Backup-SHA256': meta.sha256,
    });
    return new StreamableFile(stream);
  }

  @Post(':id/restore')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Restaurar la base de datos desde un respaldo',
    description:
      'Requiere contraseña del admin y repetir el id. Verifica SHA-256, toma un respaldo de seguridad, restaura en una transacción, aplica migraciones y cierra todas las sesiones. La auditoría no se modifica.',
  })
  @ApiOkResponse({ type: RestoreResultDto })
  @ApiResponse({ status: 400, description: 'Confirmación no coincide' })
  @ApiResponse({ status: 401, description: 'Contraseña incorrecta' })
  @ApiResponse({
    status: 409,
    description: 'Integridad fallida u operación en curso',
  })
  restore(
    @Param('id') id: string,
    @Body() dto: RestoreBackupDto,
    @CurrentUser() user: User,
  ): Promise<RestoreResultDto> {
    return this.backups.restore(
      id,
      { id: user.id, email: user.email },
      dto.password,
      dto.confirm,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un respaldo' })
  @ApiOkResponse({ description: 'Eliminado' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.backups.remove(id);
  }
}

import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AdminGuard } from '../../auth/guards';
import { AuditLog } from './audit-log.entity';
import { AuditPageDto, QueryAuditDto } from './audit.dto';
import { AuditService } from './audit.service';

/** Solo lectura: los registros no se pueden editar ni borrar (tampoco en BD). */
@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar registros de auditoría (filtros y paginación)',
  })
  @ApiOkResponse({ type: AuditPageDto })
  find(@Query() query: QueryAuditDto): Promise<AuditPageDto> {
    return this.audit.find(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de un registro de auditoría' })
  @ApiOkResponse({ type: AuditLog })
  async findOne(@Param('id') id: string): Promise<AuditLog> {
    if (!/^\d{1,19}$/.test(id)) throw new NotFoundException();
    const log = await this.audit.findOne(id);
    if (!log) throw new NotFoundException('Registro no encontrado');
    return log;
  }
}

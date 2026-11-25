import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';

import {
  BadRequestException,
  Body,
  Controller,
  Req,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  Res,
  StreamableFile,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';

import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { PdfService } from '../../../common/pdf';
import { Treatment } from '../../treatments/entities/treatment.entity';
import { User } from '../../users/entities';
import {
  ReportRequestDto,
  ThermalTreatmentInputDto,
} from '../dto/thermal-input.dto';
import { Evaluation } from '../entities/evaluation.entity';
import { checkCriteria } from '../services/thermal-analysis.service';
import {
  ThermalCalculatorService,
  ThermalTreatmentInput,
} from '../services/thermal-calculator.service';
import { ReportGeneratorService } from '../services/report-generator.service';

/** ?format=pdf o Accept: application/pdf → PDF; si no, JSON (contrato actual). */
function wantsPdf(format?: string, accept?: string): boolean {
  return format === 'pdf' || !!accept?.includes('application/pdf');
}

const FORMAT_QUERY = ApiQuery({
  name: 'format',
  required: false,
  enum: ['json', 'pdf'],
  description: 'pdf → application/pdf (equivale a Accept: application/pdf)',
});

/**
 * @description Controlador para generación de reportes de evaluación
 * Implementa el Paso 9 del documento: Generación de reportes
 */
@ApiTags('Evaluation Reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly thermalCalculatorService: ThermalCalculatorService,
    private readonly reportGeneratorService: ReportGeneratorService,
    private readonly pdf: PdfService,
    @InjectRepository(Evaluation)
    private readonly evaluations: Repository<Evaluation>,
    @InjectRepository(Treatment)
    private readonly treatments: Repository<Treatment>,
  ) {}

  /**
   * Entrada térmica: desde la evaluación o el diseño propios (si se indica id),
   * con los campos del body encima. Valida el resultado completo.
   */
  private async resolveInput(
    body: ReportRequestDto,
    userId: number,
  ): Promise<ThermalTreatmentInput> {
    // Lo que no sea campo térmico (code, score, criteria…) lo descarta whitelist abajo
    const { evaluationId, treatmentId, thermalInput, ...overrides } = body;
    let base: Partial<ThermalTreatmentInput> = {};

    if (evaluationId) {
      const ev = await this.evaluations.findOne({
        where: { id: evaluationId, evaluatedBy: { id: userId } },
      });
      if (!ev) throw new NotFoundException('Evaluación no encontrada');
      const tc = ev.thermalCalculations;
      base =
        tc?.input ?? (tc?.diameter != null ? tc : undefined) ?? thermalInput;
      if (!base) {
        throw new UnprocessableEntityException(
          'La evaluación no tiene datos térmicos guardados (thermalCalculations.input); envíe el payload',
        );
      }
    } else if (thermalInput) {
      base = thermalInput;
    } else if (treatmentId) {
      const t = await this.treatments.findOne({
        where: { id: treatmentId, createdBy: { id: userId }, deleted: false },
      });
      if (!t) throw new NotFoundException('Diseño no encontrado');
      base = {
        diameter: t.selectedDiameter,
        length: t.selectedLength,
        totalFlow: t.totalFlow,
        waterFraction: t.waterFraction,
        apiGravity: t.apiGravity,
        inletTemperature: t.inputTemperature,
        treatmentTemperature: t.treatmentTemperature,
        ambientTemperature: t.ambientTemperature,
        // El diseño no guarda presión de operación: se asume la de diseño salvo override
        operatingPressure: t.designPressure,
        oilRetentionTime: t.oilRetentionTime,
        waterRetentionTime: t.waterRetentionTime,
        windSpeed: t.windSpeed,
      };
    }

    const defined = Object.fromEntries(
      Object.entries(overrides).filter(([, v]) => v !== undefined),
    );
    // Columnas decimal llegan como texto desde Postgres: conversión por tipo declarado
    const input = plainToInstance(
      ThermalTreatmentInputDto,
      { ...base, ...defined },
      { enableImplicitConversion: true },
    );
    const errors = validateSync(input, { whitelist: true });
    if (errors.length) {
      const messages = errors.flatMap((e) =>
        Object.values(e.constraints ?? {}),
      );
      throw evaluationId || treatmentId
        ? new UnprocessableEntityException(messages)
        : new BadRequestException(messages);
    }
    return input;
  }

  private sendPdf(
    res: Response,
    filename: string,
    report: { buffer: Buffer; sha256: string },
  ): StreamableFile {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-Report-SHA256': report.sha256,
    });
    return new StreamableFile(report.buffer);
  }

  /**
   * @description Genera un reporte completo de evaluación según Paso 9
   * @ApiOperation Generar reporte completo
   * @ApiResponse 200 - Reporte generado exitosamente
   * @ApiResponse 400 - Datos de entrada inválidos
   */
  @Post('evaluation-report')
  @ApiOperation({
    summary: 'Generar reporte completo de evaluación',
    description:
      'Genera un reporte completo según el formato del Paso 9 del documento, incluyendo tabla de resultados, resumen ejecutivo y datos para gráficas',
  })
  @ApiBody({
    type: ReportRequestDto,
    description: 'Datos de entrada del tratador térmico',
    examples: {
      example1: {
        summary: 'Ejemplo de evaluación completa',
        value: {
          diameter: 6.0,
          length: 20.0,
          totalFlow: 500,
          waterFraction: 20,
          apiGravity: 18,
          inletTemperature: 75,
          treatmentTemperature: 140,
          ambientTemperature: 30,
          operatingPressure: 50,
          oilRetentionTime: 60,
          waterRetentionTime: 30,
          windSpeed: 15,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Reporte de evaluación generado exitosamente (JSON, o PDF con ?format=pdf / Accept: application/pdf)',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            reportData: { type: 'object' },
            resultsTable: { type: 'array', items: { type: 'object' } },
            executiveSummary: { type: 'object' },
            simulationCharts: { type: 'object' },
          },
        },
      },
      'application/pdf': { schema: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @FORMAT_QUERY
  @ApiResponse({ status: 404, description: 'Evaluación/diseño no encontrado' })
  @ApiResponse({ status: 422, description: 'Datos guardados incompletos' })
  async generateEvaluationReport(
    @Body() body: ReportRequestDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Query('format') format?: string,
  ) {
    const input = await this.resolveInput(body, user.id);
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);
    const report = this.reportGeneratorService.generateCompleteReport(
      input,
      results,
    );
    if (!wantsPdf(format, req.headers.accept)) return report;

    const criteria = checkCriteria(results);
    const summary = report.executiveSummary;
    const payload = {
      source: {
        evaluationId: body.evaluationId,
        treatmentId: body.treatmentId,
      },
      input,
      resultsTable: report.resultsTable,
      criteria,
      compliance: report.reportData.compliance,
    };
    const pdf = await this.pdf.render(
      summary.title,
      `${body.code ? `Código ${body.code} · ` : ''}${body.evaluationId ? `Evaluación #${body.evaluationId} · ` : ''}Generado ${new Date().toISOString()} · Metodología API-12L`,
      [
        { heading: 'Resumen ejecutivo', text: summary.summary },
        { heading: 'Hallazgos clave', bullets: summary.keyFindings },
        { heading: 'Estado de cumplimiento', text: summary.compliance },
        {
          heading: 'Criterios API-12L',
          table: {
            headers: ['Criterio', 'Valor', 'Límite', 'Margen %', 'Cumple'],
            rows: criteria.map((c) => [
              c.criterion,
              c.value,
              c.limit,
              c.marginPercent,
              c.passes,
            ]),
          },
        },
        {
          heading: 'Tabla de resultados',
          table: {
            headers: ['Categoría', 'Parámetro', 'Valor', 'Unidad'],
            rows: report.resultsTable.map((r) => [
              r.category,
              r.parameter,
              r.value,
              r.unit,
            ]),
          },
        },
        {
          heading: 'Advertencias',
          bullets: report.reportData.compliance.warnings,
        },
        { heading: 'Recomendaciones', bullets: summary.recommendations },
      ],
      payload,
    );
    const name = body.evaluationId
      ? `evaluation-${body.evaluationId}`
      : 'evaluation';
    return this.sendPdf(res, `${name}-api12l.pdf`, pdf);
  }

  /**
   * @description Genera solo la tabla de resultados según el formato del Paso 9
   * @ApiOperation Generar tabla de resultados
   * @ApiResponse 200 - Tabla generada exitosamente
   */
  @Post('results-table')
  @ApiOperation({
    summary: 'Generar tabla de resultados',
    description:
      'Genera la tabla de resultados según el formato del Paso 9 del documento',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tabla de resultados generada exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          parameter: { type: 'string' },
          value: { type: 'string' },
          unit: { type: 'string' },
          category: { type: 'string' },
        },
      },
    },
  })
  generateResultsTable(@Body() input: ThermalTreatmentInputDto) {
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);
    const reportData = this.reportGeneratorService.generateEvaluationReport(
      input,
      results,
    );

    return this.reportGeneratorService.generateResultsTable(reportData);
  }

  /**
   * @description Genera resumen ejecutivo del reporte
   * @ApiOperation Generar resumen ejecutivo
   * @ApiResponse 200 - Resumen generado exitosamente
   */
  @Post('executive-summary')
  @ApiOperation({
    summary: 'Generar resumen ejecutivo',
    description: 'Genera un resumen ejecutivo del reporte de evaluación',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumen ejecutivo generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        summary: { type: 'string' },
        keyFindings: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        compliance: { type: 'string' },
      },
    },
  })
  generateExecutiveSummary(@Body() input: ThermalTreatmentInputDto) {
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);
    const reportData = this.reportGeneratorService.generateEvaluationReport(
      input,
      results,
    );

    return this.reportGeneratorService.generateExecutiveSummary(reportData);
  }

  /**
   * @description Genera datos para gráficas de simulación
   * @ApiOperation Generar datos para gráficas
   * @ApiResponse 200 - Datos generados exitosamente
   */
  @Post('simulation-charts')
  @ApiOperation({
    summary: 'Generar datos para gráficas de simulación',
    description:
      'Genera datos para las gráficas de simulación según Figuras 4-1, 4-2, 4-3 del documento',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Datos para gráficas generados exitosamente',
    schema: {
      type: 'object',
      properties: {
        flowRatesChart: { type: 'object' },
        retentionVolumesChart: { type: 'object' },
        heatRequirementsChart: { type: 'object' },
      },
    },
  })
  generateSimulationCharts(@Body() input: ThermalTreatmentInputDto) {
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);

    return this.reportGeneratorService.generateSimulationChartsData(results);
  }

  /**
   * @description Genera reporte de cumplimiento API-12L
   * @ApiOperation Generar reporte de cumplimiento
   * @ApiResponse 200 - Reporte de cumplimiento generado
   */
  @Post('compliance-report')
  @ApiOperation({
    summary: 'Generar reporte de cumplimiento API-12L',
    description:
      'Genera un reporte detallado del cumplimiento con la norma API-12L',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Reporte de cumplimiento generado exitosamente (JSON, o PDF con ?format=pdf / Accept: application/pdf)',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            compliant: { type: 'boolean' },
            dimensionalCompliant: { type: 'boolean' },
            pressureCompliant: { type: 'boolean' },
            heatCapacityCompliant: { type: 'boolean' },
            warnings: { type: 'array', items: { type: 'string' } },
            recommendations: { type: 'array', items: { type: 'string' } },
            score: { type: 'number' },
          },
        },
      },
      'application/pdf': { schema: { type: 'string', format: 'binary' } },
    },
  })
  @FORMAT_QUERY
  @ApiResponse({ status: 404, description: 'Evaluación/diseño no encontrado' })
  @ApiResponse({ status: 422, description: 'Datos guardados incompletos' })
  async generateComplianceReport(
    @Body() body: ReportRequestDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Query('format') format?: string,
  ) {
    const input = await this.resolveInput(body, user.id);
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);

    // Score solo por flags estructurales (warnings ya reflejan el resto)
    let score = 100;
    if (!results.dimensionalCompliance) score -= 25;
    if (!results.pressureCompliance) score -= 25;
    if (!results.heatCapacityCompliance) score -= 25;
    if (!results.api12lCompliance) score -= 25;

    const report = {
      compliant: results.api12lCompliance,
      dimensionalCompliant: results.dimensionalCompliance,
      pressureCompliant: results.pressureCompliance,
      heatCapacityCompliant: results.heatCapacityCompliance,
      warnings: results.complianceWarnings,
      recommendations: results.optimizationRecommendations,
      score: Math.max(0, score),
    };
    if (!wantsPdf(format, req.headers.accept)) return report;

    const criteria = checkCriteria(results);
    const pdf = await this.pdf.render(
      'Reporte de cumplimiento API-12L',
      `${body.treatmentId ? `Diseño #${body.treatmentId} · ` : ''}${body.evaluationId ? `Evaluación #${body.evaluationId} · ` : ''}Generado ${new Date().toISOString()}`,
      [
        {
          heading: 'Resultado',
          fields: [
            ['Cumple API-12L', report.compliant],
            ['Puntaje', report.score],
            ['Dimensiones', report.dimensionalCompliant],
            ['Presión de diseño', report.pressureCompliant],
            ['Capacidad de cámara', report.heatCapacityCompliant],
          ],
        },
        {
          heading: 'Datos de diseño evaluados',
          fields: [
            ['Diámetro × longitud (ft)', `${input.diameter} × ${input.length}`],
            ['Orientación', input.vesselOrientation ?? 'horizontal'],
            ['Caudal total (BPD)', input.totalFlow],
            ['Agua (%)', input.waterFraction],
            ['°API', input.apiGravity],
            [
              'T entrada / tratamiento / ambiente (°F)',
              `${input.inletTemperature} / ${input.treatmentTemperature ?? '—'} / ${input.ambientTemperature}`,
            ],
            ['Presión de operación (psig)', input.operatingPressure],
            ['Calor total requerido (BTU/h)', results.totalHeatRequired],
            [
              'Tamaño recomendado (ft)',
              `${results.recommendedDiameter} × ${results.recommendedLength}`,
            ],
          ],
        },
        {
          heading: 'Criterios',
          table: {
            headers: ['Criterio', 'Valor', 'Límite', 'Margen %', 'Cumple'],
            rows: criteria.map((c) => [
              c.criterion,
              c.value,
              c.limit,
              c.marginPercent,
              c.passes,
            ]),
          },
        },
        { heading: 'Advertencias', bullets: report.warnings },
        { heading: 'Recomendaciones', bullets: report.recommendations },
      ],
      {
        source: {
          evaluationId: body.evaluationId,
          treatmentId: body.treatmentId,
        },
        input,
        report,
        criteria,
      },
    );
    const name = body.treatmentId
      ? `treatment-${body.treatmentId}`
      : body.evaluationId
        ? `evaluation-${body.evaluationId}`
        : 'design';
    return this.sendPdf(res, `${name}-compliance-api12l.pdf`, pdf);
  }
}

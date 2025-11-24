import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

import { CalculateTreatmentDto } from '../dto';

@Injectable()
export class CalculateTreatmentValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('[ValidationPipe] === VALIDANDO CALCULATE TREATMENT DTO ===');
    console.log('[ValidationPipe] Valor recibido:', JSON.stringify(value, null, 2));
    console.log('[ValidationPipe] Metadata:', metadata);
    
    try {
      const dto = value as CalculateTreatmentDto;
      console.log('[ValidationPipe] DTO parseado:', {
        targetTemperature: dto.targetTemperature,
        inletTemperature: dto.inletTemperature,
        waterFraction: dto.waterFraction,
        totalFlow: dto.totalFlow,
        apiGravity: dto.apiGravity,
        ambientTemperature: dto.ambientTemperature,
        oilRetentionTime: dto.oilRetentionTime,
        waterRetentionTime: dto.waterRetentionTime,
        windSpeed: dto.windSpeed
      });

      console.log('[ValidationPipe] Validando temperatura objetivo vs temperatura de entrada...');
      if (dto.targetTemperature <= dto.inletTemperature) {
        console.error('[ValidationPipe] ❌ ERROR: targetTemperature <= inletTemperature');
        console.error('[ValidationPipe] targetTemperature:', dto.targetTemperature);
        console.error('[ValidationPipe] inletTemperature:', dto.inletTemperature);
        throw new BadRequestException(
          'La temperatura objetivo debe ser mayor que la temperatura de entrada',
        );
      }
      console.log('[ValidationPipe] ✅ Validación de temperaturas OK');

      // ✅ Corregido: waterFraction viene en formato porcentaje (0-100), no decimal (0-1)
      console.log('[ValidationPipe] Validando fracción de agua...');
      if (dto.waterFraction > 90) {
        console.error('[ValidationPipe] ❌ ERROR: waterFraction > 90');
        console.error('[ValidationPipe] waterFraction:', dto.waterFraction);
        throw new BadRequestException(
          'Para fracciones de agua >90%, considere un sistema de tratamiento diferente',
        );
      }
      console.log('[ValidationPipe] ✅ Validación de fracción de agua OK');

      console.log('[ValidationPipe] === VALIDACIÓN COMPLETADA EXITOSAMENTE ===');
      return value;
    } catch (error) {
      console.error('[ValidationPipe] ❌ ERROR EN VALIDACIÓN:', error);
      console.error('[ValidationPipe] Tipo de error:', error?.constructor?.name);
      console.error('[ValidationPipe] Mensaje:', error?.message);
      console.error('[ValidationPipe] Stack:', error?.stack);
      throw error;
    }
  }
}

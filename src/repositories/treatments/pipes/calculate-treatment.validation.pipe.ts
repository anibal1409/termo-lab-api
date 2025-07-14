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
    const dto = value as CalculateTreatmentDto;

    if (dto.targetTemperature <= dto.inletTemperature) {
      throw new BadRequestException(
        'La temperatura objetivo debe ser mayor que la temperatura de entrada',
      );
    }

    if (dto.waterFraction > 0.9) {
      throw new BadRequestException(
        'Para fracciones de agua >90%, considere un sistema de tratamiento diferente',
      );
    }

    return value;
  }
}

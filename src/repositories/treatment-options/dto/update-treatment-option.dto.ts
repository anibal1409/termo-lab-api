import { PartialType } from '@nestjs/swagger';
import { CreateTreatmentOptionDto } from './create-treatment-option.dto';

export class UpdateTreatmentOptionDto extends PartialType(CreateTreatmentOptionDto) {}

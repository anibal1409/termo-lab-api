import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { QueryBaseDto } from '../../../common/pagination/dto/query-base.dto';

/**
 * @enum EvaluationType
 * @description Possible types of evaluations
 */
export enum EvaluationType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

/**
 * @description DTO for querying evaluations with pagination and filters
 * @extends QueryBaseDto
 */
export class QueryEvaluationDto extends QueryBaseDto {
  @ApiPropertyOptional({
    description: 'Filter by evaluation type',
    enum: ['internal', 'external'],
    example: 'internal',
  })
  @IsEnum(['internal', 'external'])
  @IsOptional()
  evaluationType?: 'internal' | 'external';

  @ApiPropertyOptional({
    description: 'Filter by minimum score',
    example: 70,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  minScore?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum score',
    example: 100,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  maxScore?: number;

  @ApiPropertyOptional({
    description: 'Filter by approval status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  approved?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by template ID',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  templateId?: number;

  @ApiPropertyOptional({
    description: 'Filter by minimum evaluation date (ISO string)',
    example: '2023-01-01T00:00:00Z',
  })
  @IsString()
  @IsOptional()
  minDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by maximum evaluation date (ISO string)',
    example: '2023-12-31T23:59:59Z',
  })
  @IsString()
  @IsOptional()
  maxDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by evaluator user ID',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  evaluatedById?: number;
}

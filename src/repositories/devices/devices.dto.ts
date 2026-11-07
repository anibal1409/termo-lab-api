import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { ChannelType, COMMAND_REGEX, PIN_REGEX } from './control';

export class CreateDeviceDto {
  @ApiProperty({ example: 'Tratador piloto' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '/dev/ttyUSB0' })
  @Matches(/^(\/dev\/tty[\w.-]+|COM\d{1,3})$/, {
    message: 'Puerto inválido (ej. /dev/ttyUSB0 o COM3)',
  })
  path: string;

  @ApiPropertyOptional({ example: 115200 })
  @IsOptional()
  @IsIn([9600, 19200, 38400, 57600, 115200])
  baudRate?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  autoConnect?: boolean;
}
export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}

export class CreateChannelDto {
  @ApiProperty({ example: 'Temperatura del baño' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: ChannelType })
  @IsEnum(ChannelType)
  type: ChannelType;

  @ApiProperty({ example: ['10', '13', '12'] })
  @ArrayMaxSize(5)
  @Matches(PIN_REGEX, { each: true, message: 'Pin inválido (ej. 7, D7, A0)' })
  pins: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  pullup?: boolean;

  @ApiPropertyOptional({ example: '°C' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  factor?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  offset?: number;

  @ApiPropertyOptional({ example: 1000, description: '0 = no leer' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3_600_000)
  pollMs?: number;
}
export class UpdateChannelDto extends PartialType(CreateChannelDto) {}

export class WriteChannelDto {
  @ApiProperty({
    example: 1,
    description: 'digital 0/1, pwm 0-255, servo 0-180',
  })
  @IsNumber()
  value: number;
}

export class CreateRuleDto {
  @ApiProperty({ example: 'Corte por sobretemperatura' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsInt()
  sourceChannelId: number;

  @ApiProperty({ enum: ['>', '<'] })
  @IsIn(['>', '<'])
  operator: '>' | '<';

  @ApiProperty({ example: 80 })
  @IsNumber()
  threshold: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hysteresis?: number;

  @ApiProperty()
  @IsInt()
  targetChannelId: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  onValue: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  offValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
export class UpdateRuleDto extends PartialType(CreateRuleDto) {}

export class CreatePidDto {
  @ApiProperty({ example: 'Control temperatura baño' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsInt()
  inputChannelId: number;

  @ApiProperty()
  @IsInt()
  outputChannelId: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  setpoint: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  kp?: number;

  @ApiPropertyOptional({ example: 0.1 })
  @IsOptional()
  @IsNumber()
  ki?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  kd?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  outMin?: number;

  @ApiPropertyOptional({ example: 255 })
  @IsOptional()
  @IsNumber()
  outMax?: number;

  @ApiPropertyOptional({ example: 10000 })
  @IsOptional()
  @IsInt()
  @Min(1000)
  windowMs?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
export class UpdatePidDto extends PartialType(CreatePidDto) {}

export class RawCommandDto {
  @ApiProperty({ example: 'WRITE 13 1' })
  @Matches(COMMAND_REGEX, { message: 'Comando no permitido' })
  command: string;
}

export class ReadingsQueryDto {
  @ApiPropertyOptional({ example: '2026-11-06T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-11-07T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ example: 1000, default: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  limit?: number;
}

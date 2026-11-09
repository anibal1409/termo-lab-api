import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class FaceLoginDto {
  @ApiProperty({
    description: 'Vector de embedding facial (128-d) generado por face-api.js',
    type: [Number],
    example: [0.1, -0.05, 0.23],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(128)
  @ArrayMaxSize(128)
  embedding: number[];
}

export class EnrollFaceDto {
  @ApiProperty({
    description: 'Vector de embedding facial (128-d) para registrar',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(128)
  @ArrayMaxSize(128)
  embedding: number[];
}

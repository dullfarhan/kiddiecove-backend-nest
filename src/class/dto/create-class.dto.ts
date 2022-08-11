import { ApiProperty } from '@nestjs/swagger';

import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';

enum STANDARD {
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TENTH',
}

export class CreateClassDto {
  @ApiProperty({ enum: STANDARD, required: true })
  @MinLength(3)
  @MaxLength(5)
  @IsNotEmpty()
  @IsEnum(STANDARD)
  standard: string;

  @ApiProperty({ type: String, required: false })
  @IsMongoId()
  @IsOptional()
  school_id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: false })
  @IsMongoId()
  @IsOptional()
  teacher_id: mongoose.Types.ObjectId;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
import { CreateClassDto } from './create-class.dto';

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

export class UpdateClassDto extends PartialType(CreateClassDto) {
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

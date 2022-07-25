import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
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
  //   @Min(3)
  //   @Max(5)
  @IsNotEmpty()
  @IsEnum(STANDARD)
  standard: string;

  @ApiProperty({ type: mongoose.Types.ObjectId, required: false })
  @IsMongoId()
  @IsOptional()
  school_id: mongoose.Types.ObjectId;

  @ApiProperty({ type: mongoose.Types.ObjectId, required: false })
  @IsMongoId()
  @IsOptional()
  teacher_id: mongoose.Types.ObjectId;
}

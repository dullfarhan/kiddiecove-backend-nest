import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';

enum icon {
  'lock',
  'favorite',
  'description',
  'date_range',
  'add_circle',
  'language',
  'people',
}

export class CreatePostDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  date: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(5)
  @MaxLength(5)
  time: string;

  @ApiProperty({ enum: icon, required: true })
  @IsEnum(icon)
  @MinLength(4)
  @MaxLength(12)
  icon: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  @IsUrl()
  @MinLength(2)
  @MaxLength(300)
  avatar: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  @IsNotEmpty()
  image: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @MinLength(2)
  @MaxLength(500)
  content: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  @IsMongoId()
  school_id: mongoose.Types.ObjectId;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDataURI,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { GenderType } from 'src/utils/enums/GenderType.enum';
import { CreateKidDto } from './create-kid.dto';

export class UpdateKidDto extends PartialType(CreateKidDto) {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @Min(5)
  @Max(20)
  @IsNotEmpty()
  age: number;

  @ApiProperty({ type: Date })
  @IsDateString()
  @IsOptional()
  birthday_date: Date;

  @ApiProperty({ enum: GenderType, required: true })
  @IsEnum(GenderType)
  @MinLength(4)
  @MaxLength(6)
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty({ type: String, required: true })
  @IsDataURI()
  @IsOptional()
  avatar: string;
}

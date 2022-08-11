import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true })
  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ type: String, required: true })
  @MinLength(1)
  @MaxLength(5)
  @IsNotEmpty()
  @IsString()
  country_code: string;

  @ApiProperty({ type: Number, required: true })
  @Min(5)
  @Max(15)
  @IsNotEmpty()
  @IsNumber()
  number_lenght: number;

  @ApiProperty({ type: Boolean, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ type: Boolean, required: false, default: false })
  deleted: boolean;
}

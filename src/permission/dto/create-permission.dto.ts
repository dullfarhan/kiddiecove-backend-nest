import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(3, 60)
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(3, 60)
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateEndpointDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(3, 70)
  @IsNotEmpty()
  endpoint: string;

  @ApiProperty({ type: Boolean, required: true })
  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(300)
  @IsUrl()
  avatar: string;

  @ApiProperty({ type: String, required: true })
  @MinLength(3)
  @MaxLength(80)
  @IsString()
  date: string;

  @ApiProperty({ type: String, required: true })
  @MinLength(2)
  @MaxLength(500)
  @IsString()
  message: string;
}

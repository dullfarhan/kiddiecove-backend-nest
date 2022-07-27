import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(300)
  @IsUrl()
  avatar: string;

  @MinLength(3)
  @MaxLength(80)
  @IsString()
  date: string;

  @MinLength(2)
  @MaxLength(500)
  @IsString()
  message: string;
}

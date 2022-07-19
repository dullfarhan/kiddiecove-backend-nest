import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @Length(3, 60)
  name: string;

  @IsString()
  @Length(3, 60)
  @IsNotEmpty()
  endpoint: string;

  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}

import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateEndpointDto {
  @IsString()
  @Length(3, 70)
  @IsNotEmpty()
  endpoint: string;
  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}

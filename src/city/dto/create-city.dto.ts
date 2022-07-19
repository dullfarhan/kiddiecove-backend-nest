import {
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateCityDto {
  // _id: mongoose.Types.ObjectId;

  @IsString()
  @Length(3, 40)
  name: string;

  @IsString()
  @Length(2, 40)
  code: string;

  @IsMongoId()
  country_id: string;

  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}

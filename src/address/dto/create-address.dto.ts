import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateAddressDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  address_details: string;

  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty()
  area_name: string;

  @IsOptional()
  @IsObject()
  location: Object;

  @IsNotEmpty()
  city_id: mongoose.Types.ObjectId;

  @IsBoolean()
  @Optional()
  enable: boolean;

  @IsBoolean()
  @Optional()
  deleted: boolean;
}

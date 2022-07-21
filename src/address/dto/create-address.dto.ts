import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  address_details: string;

  @ApiProperty({ type: String, required: true })
  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty()
  area_name: string;

  @ApiProperty({ type: Object, required: true })
  @IsOptional()
  @IsObject()
  location: Object;

  @ApiProperty({ type: mongoose.Types.ObjectId })
  @IsNotEmpty()
  city_id: mongoose.Types.ObjectId;

  @ApiProperty({ type: Boolean, required: false })
  @IsBoolean()
  @IsOptional()
  enable: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsBoolean()
  @IsOptional()
  deleted: boolean;
}

import { PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { CreateUserDto } from 'src/user/Dtos/create-user.dto';
import { CreateDriverDto } from './create-driver.dto';

export class UpdateDriverDto extends PartialType(CreateDriverDto) {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(40)
  license_number: string;

  @IsNumber()
  @Min(10000)
  @Max(100000)
  @IsNotEmpty()
  salary: number;

  @IsOptional()
  school_id: mongoose.Types.ObjectId;
}

export type UpdateDriverDtoWithUserAndAddress = UpdateDriverDto &
  CreateUserDto &
  CreateAddressDto;

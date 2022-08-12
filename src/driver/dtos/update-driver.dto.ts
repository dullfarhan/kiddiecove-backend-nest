import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
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

export class UpdateDriverDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  license_number: string;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  @Min(10000)
  @Max(100000)
  @IsNotEmpty()
  salary: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  school_id: string;
}

export class UpdateDriverDtoWithCreateUserDtoAndCreateAddressDto extends IntersectionType(
  CreateUserDto,
  CreateAddressDto,
) {}

export class UpdateDriverDtoWithUserAndAddress extends IntersectionType(
  UpdateDriverDtoWithCreateUserDtoAndCreateAddressDto,
  UpdateDriverDto,
) {}

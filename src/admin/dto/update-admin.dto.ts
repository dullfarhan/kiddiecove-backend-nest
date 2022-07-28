import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { CreateUserDto } from 'src/user/Dtos/create-user.dto';
import { CreateAdminDto } from './create-admin.dto';

class UpdateAdminDtoAlone extends PartialType(CreateAdminDto) {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  @IsUppercase()
  @IsEnum(['ROOT', 'CLIENT'])
  admin_type: string;
}

class UpdateAdminDtoWithUserDto extends IntersectionType(
  UpdateAdminDtoAlone,
  CreateUserDto,
) {}

export class UpdateAdminDto extends IntersectionType(
  UpdateAdminDtoWithUserDto,
  CreateAddressDto,
) {}

import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import mongoose from 'mongoose';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
enum TypeEnum {
  STATE = 'STATE',
  PRIVATE = 'PRIVATE',
}
export class SchoolDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(3, 40)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(2, 300)
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: TypeEnum, required: true })
  @IsString()
  @Length(5, 7)
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  type: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  campus_code: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(3, 50)
  @IsString()
  branch_name: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsPhoneNumber('PK')
  @Length(3, 15)
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ type: mongoose.Types.ObjectId, required: true })
  @IsNotEmpty()
  @IsMongoId()
  school_admin_id: mongoose.Types.ObjectId;
}

export class CreateSchoolDto extends IntersectionType(
  SchoolDto,
  CreateAddressDto,
) {}

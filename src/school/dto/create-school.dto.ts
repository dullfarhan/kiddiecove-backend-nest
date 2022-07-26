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
enum TypeEnum {
  STATE = 'state',
  PRIVATE = 'private',
}
export class CreateSchoolDto {
  @IsString()
  @Length(3, 40)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(2, 300)
  @IsNotEmpty()
  description: string;

  @IsString()
  @Length(5, 7)
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  type: string;

  @IsString()
  @Length(3, 50)
  @IsNotEmpty()
  campus_code: string;

  @IsString()
  @Length(3, 50)
  @IsEmail()
  branch_name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber()
  @Length(3, 15)
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  @IsMongoId()
  school_admin_id: mongoose.Types.ObjectId;
}

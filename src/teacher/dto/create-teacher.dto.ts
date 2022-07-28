import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import mongoose from 'mongoose';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { CreateUserDto } from 'src/user/Dtos/create-user.dto';

enum TeacherType {
  SENIOR = 'senior',
  JUNIOR = 'junior',
}
export class TeacherDto {
  @IsOptional()
  @IsMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(3, 40)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @Length(3, 40)
  @IsNotEmpty()
  @IsEnum(TeacherType)
  designation: string;

  @ApiProperty({ type: Number, required: true })
  @Min(10000)
  @Max(100000)
  @IsNotEmpty()
  salary: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsMongoId()
  school_id: mongoose.Types.ObjectId;
}

export class TeacherUserDto extends IntersectionType(
  TeacherDto,
  CreateUserDto,
) {}

export class CreateTeacherDto extends IntersectionType(
  TeacherUserDto,
  CreateAddressDto,
) {}

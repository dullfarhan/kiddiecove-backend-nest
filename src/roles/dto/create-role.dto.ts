import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  Length,
} from 'class-validator';
import mongoose, { isValidObjectId } from 'mongoose';
import { Type } from 'class-transformer';
import { RoleType } from 'src/utils/enums/RoleType';
import { ApiProperty } from '@nestjs/swagger';

class permissionItem {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  _id: mongoose.Types.ObjectId;
}
export class CreateRoleDto {
  // @ApiProperty({ type: String, required: true })
  // @IsNotEmpty()
  // @IsMongoId()
  // // _id: mongoose.Types.ObjectId;

  @ApiProperty({ enum: RoleType, required: false })
  @IsString()
  @IsEnum(RoleType)
  @Length(3, 12)
  @IsUppercase()
  name: string;

  // @IsArray()
  // @IsNotEmpty()

  @ApiProperty({ type: [String], required: true })
  @IsArray()
  @IsMongoId({ each: true })
  // @Type(() => mongoose.Types.ObjectId)
  permissions: [mongoose.Types.ObjectId];

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}

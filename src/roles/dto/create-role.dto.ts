import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUppercase,
  Length,
} from 'class-validator';
import mongoose, { isValidObjectId } from 'mongoose';
import { Type } from 'class-transformer';
import { RoleType } from 'src/enums/RoleType';
import { ApiProperty } from '@nestjs/swagger';

class permissionItem {
  @ApiProperty()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  name: string;
}
export class CreateRoleDto {
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ enum: RoleType, required: true })
  @IsString()
  @IsEnum(RoleType)
  @Length(3, 12)
  @IsUppercase()
  name: string;

  // @IsArray()
  // @IsNotEmpty()
  @ApiProperty()
  @Type(() => permissionItem)
  permissions: [permissionItem] | null;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}

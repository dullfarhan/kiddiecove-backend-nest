import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUppercase,
  Length,
} from 'class-validator';
import mongoose, { isValidObjectId } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  _id: mongoose.Types.ObjectId;

  @IsString()
  @IsEnum(RoleType)
  @Length(3, 12)
  @IsUppercase()
  name: string;

  @IsArray()
  @IsNotEmpty()
  @Type(() => permissionItem)
  permissions: permissionItem;
  @IsBoolean()
  enable: boolean;
  @IsBoolean()
  deleted: boolean;
}

class permissionItem {
  @IsNotEmpty()
  _id: mongoose.Types.ObjectId;

  @IsString()
  name: string;
}

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

class permissionItem {
  @IsNotEmpty()
  _id: mongoose.Types.ObjectId;

  @IsString()
  name: string;
}
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

  @IsOptional()
  @IsBoolean()
  enable: boolean;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;
}

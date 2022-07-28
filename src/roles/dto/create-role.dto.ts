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
  @ApiProperty()
  @IsMongoId()
  _id: mongoose.Types.ObjectId;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  name: string;
}
export class CreateRoleDto {
  @IsOptional()
  @IsMongoId()
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

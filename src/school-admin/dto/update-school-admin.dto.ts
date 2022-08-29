import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { CreateUserDto } from 'src/user/Dtos/create-user.dto';
import { CreateSchoolAdminDto } from './create-school-admin.dto';

class UpdateSchoolAdminDtoAlone extends PartialType(CreateSchoolAdminDto) {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, required: true })
  @Transform((param) => Number.parseInt(param.value))
  @Min(10000)
  @Max(200000)
  @IsNotEmpty()
  salary: number;
}

class UpdateSchoolAdminDtoAloneWithUserDto extends IntersectionType(
  UpdateSchoolAdminDtoAlone,
  CreateUserDto,
) {}

export class UpdateSchoolAdminDto extends IntersectionType(
  UpdateSchoolAdminDtoAloneWithUserDto,
  CreateAddressDto,
) {}

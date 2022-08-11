import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
import { CreateUserDto } from 'src/user/Dtos/create-user.dto';

class CreateAdminDtoAlone {
  @ApiProperty({ type: String, required: true })
  @MaxLength(40)
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['ROOT', 'CLIENT'], required: true })
  @IsEnum(['ROOT', 'CLIENT'])
  @MinLength(4)
  @MaxLength(6)
  @IsNotEmpty()
  admin_type: string;
}

class CreateAdminDtoWithUserDto extends IntersectionType(
  CreateAdminDtoAlone,
  CreateUserDto,
) {}

export class CreateAdminDto extends IntersectionType(
  CreateAdminDtoWithUserDto,
  CreateAddressDto,
) {}

import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, length, Length } from 'class-validator';
import { ParentType } from 'src/utils/enums/ParentType';
import { CreateUserDto } from 'src/user/Dtos/create-user.dto';
import { CreateAddressDto } from 'src/address/dto/create-address.dto';
export class ParentDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @Length(3, 40)
  name: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsEnum(ParentType)
  @Length(6, 8)
  type: string;
}
export class ParentandUserDto extends IntersectionType(
  CreateUserDto,
  ParentDto,
) {}
export class CreateParentDto extends IntersectionType(
  ParentandUserDto,
  CreateAddressDto,
) {}

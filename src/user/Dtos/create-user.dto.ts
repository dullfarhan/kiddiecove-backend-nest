import { ApiProperty } from '@nestjs/swagger';
import {
  IsDataURI,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { GenderType } from 'src/utils/enums/GenderType.enum';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @ApiProperty({ type: String, required: true })
  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty()
  user_name: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  password: string;

  @ApiProperty({ enum: GenderType, required: false })
  @IsEnum(GenderType)
  @MinLength(4)
  @MaxLength(6)
  @IsOptional()
  gender: GenderType;

  @ApiProperty({ type: String, required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsPhoneNumber('PK')
  @MinLength(9)
  @Max(15)
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ type: Date, required: true })
  @IsDate()
  birthday_date: Date;

  @ApiProperty({ type: String, required: false })
  @IsDataURI({ message: 'valid avatar url is required.' })
  @IsOptional()
  avatar: string;
}

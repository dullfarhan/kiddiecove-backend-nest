import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDataURI,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
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
  @MaxLength(15)
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ type: Date, required: true })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  birthday_date: Date;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsDataURI({ message: 'valid avatar url is required.' })
  avatar: string;
}

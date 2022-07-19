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
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty()
  user_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  password: string;

  @IsEnum(GenderType)
  @MinLength(4)
  @MaxLength(6)
  @IsOptional()
  gender: GenderType;

  @IsEmail()
  email: string;

  @IsPhoneNumber('PK')
  @MinLength(9)
  @Max(15)
  @IsNotEmpty()
  phone_number: string;

  @IsDate()
  birthday_date: Date;

  @IsDataURI({ message: 'valid avatar url is required.' })
  @IsOptional()
  avatar: string;
}

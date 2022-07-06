import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: String;
}

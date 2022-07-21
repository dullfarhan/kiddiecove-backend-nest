import { ApiProperty, ApiSecurity } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserSignInDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}

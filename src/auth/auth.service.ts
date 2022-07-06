import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSignInDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(userSignInDto: UserSignInDto): Promise<{ token: String }> {
    const payload = {
      name: userSignInDto.name,
      password: userSignInDto.password,
    };
    console.log({ what: payload });
    const token = await this.jwtService.signAsync(payload, {
      secret: 'mySecureKey',
    });

    return { token };
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserSignInDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, // private jwtStrategy: JwtStrategy,
  ) {}

  @Post('signIn')
  signIn(@Body() userSignInDto: UserSignInDto) {
    console.log({ userSignInDto });
    return this.authService.signIn(userSignInDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('verify')
  // verify(@Req() req: Request, @Res() res: Response) {
  //   // console.log(req.user);
  //   console.log(req.user);
  //   res.send('HELLO WORLD');
  // }
}

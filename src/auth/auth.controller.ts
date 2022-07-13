import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserSignInDto } from './dtos';
import { JwtAuthGuard } from './Strategy/jwt.authguard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('Authentication');
  constructor(private authService: AuthService) {}

  @ApiBasicAuth()
  @Post('signin')
  signIn(@Body() userSignInDto: UserSignInDto) {
    this.logger.log('signing in ...');
    return this.authService.signIn(userSignInDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('verify')
  verify(@Req() req: Request, @Res() res: Response) {
    this.logger.log('Verifying...');
    res.send(req.user);
  }
}

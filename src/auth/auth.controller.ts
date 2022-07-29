import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserSignInDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiBasicAuth()
  @Post('token')
  signIn(@Body() userSignInDto: UserSignInDto, @Res() res: Response) {
    this.logger.log('signing in ...');
    return this.authService.signIn(userSignInDto, res);
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Get('verify')
  // verify(@Req() req: Request, @Res() res: Response) {
  //   this.logger.log('Verifying...');
  //   res.send(req.user);
  // }
}

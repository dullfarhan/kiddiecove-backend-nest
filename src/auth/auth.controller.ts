import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserSignInDto } from './dtos';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBasicAuth()
  @Post('signin')
  signIn(@Body() userSignInDto: UserSignInDto) {
    this.logger.log('signing in ...');
    return this.authService.signIn(userSignInDto);
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Get('verify')
  // verify(@Req() req: Request, @Res() res: Response) {
  //   this.logger.log('Verifying...');
  //   res.send(req.user);
  // }
}

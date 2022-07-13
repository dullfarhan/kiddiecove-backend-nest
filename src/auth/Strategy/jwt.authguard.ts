import {
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('Can Activate...');

    // console.log(context.switchToHttp().getRequest().headers.authorization);

    if (!context.switchToHttp().getRequest().headers.authorization) {
      //   const response = context
      //     .switchToHttp()
      //     .getResponse()
      //     .send('');
      throw new NotFoundException('No authentication header provided');
    }
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('Handle Request...');
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}

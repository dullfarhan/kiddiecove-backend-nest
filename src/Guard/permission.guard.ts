import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import Util from '../utils/util';
import Constant from 'src/utils/enums/Constant.enum';
@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();
    this.logger.log('checking permissions...');
    let requestedUrl =
      req.params !== null || req.query != null
        ? req.originalUrl
            .split('?')
            .shift()
            .replace('/' + req.params.id, '')
        : req.originalUrl;

    const currentUser: any = req.user;
    this.logger.log(currentUser);

    if (
      currentUser.permissions.includes(Constant.ROOT_PERMISSION) ||
      currentUser.permissions.includes(requestedUrl)
    ) {
      this.logger.log('Verified user...');
      return true;
    } else {
      this.logger.log('unverified user...');
      return false;
    }
  }
}

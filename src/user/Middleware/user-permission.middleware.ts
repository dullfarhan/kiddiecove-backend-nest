import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Util from '../../utils/util';
import Constant from 'src/utils/Constant';
@Injectable()
export class UserPermissionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('checking permissions...');
    let requestedUrl =
      req.params !== null || req.query != null
        ? req.originalUrl
            .split('?')
            .shift()
            .replace('/' + req.params.id, '')
        : req.originalUrl;

    const currentUser: any = req.user;
    if (
      currentUser.permissions.includes(Constant.ROOT_PERMISSION) ||
      currentUser.permissions.includes(requestedUrl)
    ) {
      return next();
    }
    return Util.getForbiddenRequest('Forbidden!!! Access Denied.', res);
  }
}

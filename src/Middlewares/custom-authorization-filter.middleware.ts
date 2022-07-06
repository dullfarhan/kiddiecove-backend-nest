import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CustomAuthorizationFilter implements NestMiddleware {
  jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService({
      secret: 'mySecureKey',
      signOptions: { expiresIn: '1d' },
    });
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.header('Authorization')) {
      console.log('No header provided');
      res.status(404).send('No header provided');
    }

    const token = req.header('Authorization').replace('Bearer', '').trim();
    if (!token) {
      console.log('No token provided');
      res.status(404).send('No token provided');
    }
    try {
      const user = await this.jwtService.verifyAsync(token);
      res.send(user);
      //   next();
    } catch (e) {
      console.log(e);
    }
    // if (
    //   currentUser.permissions.includes('/**') ||
    //   currentUser.permissions.includes(requestedUrl)
    // ) {
    //   return next();
    // }
    // return Util.getForbiddenRequest('Forbidden!!! Access Denied.', res);
  }
}

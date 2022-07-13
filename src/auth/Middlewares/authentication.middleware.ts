import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { ClientSecret, ClientSecretDocument } from 'src/Schemas';
import * as bcrypt from 'bcrypt';
import Util from '../../utils/util';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(ClientSecret.name)
    private readonly ClientSecrets: Model<ClientSecretDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        !req.headers.authorization ||
        req.headers.authorization.indexOf('Basic ') === -1
      ) {
        return Util.getUnauthorizedRequest('Missing Authorization Header', res);
      }
      // verify auth credentials
      const base64Credentials = req.headers.authorization.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'ascii',
      );
      const [username, password] = credentials.split(':');
      const clientSecret = await this.ClientSecrets.findOne({
        client_id: username,
      });
      if (!clientSecret) {
        return Util.getUnauthorizedRequest(
          'Invalid Authentication Credential',
          res,
        );
      }
      const validSecret = await bcrypt.compare(password, clientSecret.secret);
      if (!validSecret)
        return Util.getBadRequest('Invalid Authentication Credentials', res);
      next();
    } catch (ex) {
      return Util.getBadRequest(ex.message, res);
    }
  }
}

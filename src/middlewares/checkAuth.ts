import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('middleware chal rahy');
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(500).send({
          message: 'Authentication failed 1',
        });
      }

      const decodedToken = jwt.verify(token, 'AbdullahSecretKey');
      console.log('Token',token);
      req.body.data = { userId: decodedToken.id };
      next();
    } catch (error) {
      console.log("Hi error",error.message);
      return res.status(500).send({
        message: error,
      });
      next();
    }
  }
}

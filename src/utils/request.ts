import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RequestWithUser } from './types';
import { HttpError } from './error';
import { setRedirectHeader } from './response';
import logger from './logger';

export function checkUserInRequest(user: RequestWithUser['user']): asserts user is Required<RequestWithUser>['user'] {
  if (!user) {
    throw new HttpError(401, 'Unauthorized');
  }
}

const handleRequest = (
  handler: (req: Request<ParamsDictionary, any, any, any>, res: Response, next?: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      if ((e instanceof HttpError && e.status === 401) || e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
        if (req.path === '/login' || req.path === '/register') {
          return res.status(401).json({ message: e.message });
        } else {
          setRedirectHeader(res, '/login');

          return res.sendStatus(401);
        }
      }

      if (e instanceof HttpError) {
        const payload = {
          ...e.meta,
          message: e.message,
        };

        return res.status(e.status).json(payload);
      }

      logger.error(`${req.method} ${req.originalUrl} endpoint hit`);

      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return res.status(422).json({
            uniqueError: true,
            message: 'Unique constraint failed',
          });
        }

        if (e.code === 'P2003' || e.code === 'P2025') {
          return res.status(404).json({
            message: e.code === 'P2003' ? 'Not found' : e.message,
          });
        }

        logger.error(e);
        return res.status(502).json({ message: 'Database error' });
      }

      logger.error(e);
      return res.status(500).json({ error: (e as Error).message });
    }
  };
};

export default handleRequest;

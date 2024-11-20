import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HttpError } from './error';
import logger from './logger';
import { setRedirectHeader } from './response';
import { RequestWithUser } from './types';
import { saveLog } from './logs';
import { LogLevel } from '@prisma/client';

export function checkUserInRequest(user: RequestWithUser['user']): asserts user is Required<RequestWithUser>['user'] {
  if (!user) {
    throw new HttpError(401, 'Unauthorized');
  }
}

const handleRequest = (
  handler: (req: Request<ParamsDictionary, any, any, any>, res: Response, next?: NextFunction) => Promise<any>
) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
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

      const errorData: { message: string; status: number; context?: any } = {
        message: (e as Error)?.message,
        status: 500,
        context: {
          userId: req.user?.id,
          method: req.method,
          url: req.originalUrl,
          body: req.body,
          stackTrace: (e as Error)?.stack,
        },
      };

      if (e instanceof HttpError) {
        errorData.status = e.status;
        errorData.message = e.message;
      }

      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          errorData.status = 422;
          errorData.message = 'Unique constraint failed';
        } else if (e.code === 'P2003' || e.code === 'P2025') {
          errorData.status = 404;
          errorData.message = e.code === 'P2003' ? 'Not found' : e.message;
        } else {
          errorData.status = 502;
          errorData.message = 'Database error';
        }
      }

      await saveLog({ ...errorData, level: LogLevel.ERROR });

      logger.error(`${req.method} ${req.originalUrl} endpoint hit`);
      logger.error(e);

      return res.status(errorData.status).json({ message: errorData.message });
    }
  };
};

export default handleRequest;

export const parseJsonParams = (location: 'query' | 'body', keys: string[]) => {
  return handleRequest(async (req: Request, res: Response, next?: NextFunction) => {
    keys.forEach((key) => {
      if (req[location][key] && typeof req[location][key] === 'string') {
        try {
          req[location][key] = JSON.parse(req[location][key]);
        } catch (e) {
          if (e instanceof SyntaxError) {
            throw new HttpError(422, `"query.${key}" must be valid json`);
          }
          throw new HttpError(500, 'Failed to parse json params');
        }
      } else {
        delete req[location][key];
      }
    });

    if (next) {
      next();
    }
  });
};

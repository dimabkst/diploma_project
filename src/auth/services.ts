import bcrypt from 'bcryptjs';
import { JsonWebTokenError, sign, SignOptions, TokenExpiredError, verify } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { UserRole } from '@prisma/client';
import { ICheckAuthOptions, ITokenData, IVerifiedTokenData } from './types';
import prisma from '../db';
import { RequestWithUser } from '../utils/types';
import { removeUndefinedValues } from '../utils/data';
import { setRedirectHeader } from '../utils/response';
import { HttpError } from '../utils/error';

const { AUTH_KEY } = process.env;

const BCRYPT_SALT_ROUNDS = 10;
const JWT_ALGORITHM = 'HS256';

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
};

export const comparePassword = (enteredPassword: string, hashedPassword: string) => {
  return bcrypt.compareSync(enteredPassword, hashedPassword);
};

export const generateToken = (data: ITokenData): string => {
  const signOptions: SignOptions = { algorithm: JWT_ALGORITHM };

  if (!(data.rememberMe || data.userRole === UserRole.SUPER_ADMIN)) {
    signOptions.expiresIn = 24 * 60 * 60; // 1 day
  }

  return sign(removeUndefinedValues(data), AUTH_KEY, signOptions);
};

export const verifyToken = (token: string): IVerifiedTokenData => {
  return verify(token, AUTH_KEY, { algorithms: [JWT_ALGORITHM] }) as IVerifiedTokenData;
};

export const checkAuth = (options?: ICheckAuthOptions) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        throw new HttpError(401, 'No token provided');
      }

      const jwtData: IVerifiedTokenData = verifyToken(token);

      if (options?.superAdminOnly && jwtData.userRole !== UserRole.SUPER_ADMIN) {
        throw new HttpError(401, 'You have no access to this resource');
      }

      const user = await prisma.user.findUnique({
        where: { id: jwtData.id },
      });

      if (!user) {
        throw new HttpError(401, 'User cannot be found');
      }

      req.user = user;

      return next();
    } catch (e) {
      if (!options?.allowUnauthenticated) {
        if ((e instanceof HttpError && e.status === 401) || e instanceof JsonWebTokenError || e instanceof TokenExpiredError) {
          setRedirectHeader(res, '/login');

          return res.sendStatus(401);
        } else if (e instanceof HttpError) {
          return res.status(e.status).json({
            ...e.meta,
            message: e.message,
          });
        }

        return res.sendStatus(500);
      } else {
        return next();
      }
    }
  };
};

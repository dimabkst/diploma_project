import { Response } from 'express';
import { ILoginUserPayload } from './types';
import { comparePassword, generateToken } from './services';
import prisma from '../db';
import { UserRole } from '../db/types';
import { RequestWithBody } from '../utils/types';
import { HttpError } from '../utils/error';
import { setRedirectHeader } from '../utils/response';
import handleRequest from '../utils/request';

const loginUser = async ({ body }: RequestWithBody<ILoginUserPayload>, res: Response) => {
  const { email, password, rememberMe } = body;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
      role: true,
    },
  });

  if (!user || !comparePassword(password, user.password)) {
    throw new HttpError(401, "Email or password isn't correct. Please try again");
  }

  const token = generateToken({
    id: user.id,
    userRole: user.role as UserRole,
    rememberMe,
  });

  res.cookie('token', token, {
    httpOnly: true, // Not accessible via JavaScript
    secure: true, // Only sent over HTTPS
    sameSite: 'strict', // Prevents CSRF
  });

  setRedirectHeader(res, '/');

  return res.sendStatus(204);
};

export default handleRequest(loginUser);

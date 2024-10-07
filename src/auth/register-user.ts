import { Response } from 'express';
import { IRegisterUserPayload } from './types';
import { hashPassword } from './services';
import prisma from '../db';
import { RequestWithBody } from '../utils/types';
import { HttpError } from '../utils/error';
import { setRedirectHeader } from '../utils/response';
import handleRequest from '../utils/request';

const registerUser = async ({ body }: RequestWithBody<IRegisterUserPayload>, res: Response) => {
  const { name, email, password } = body;

  const existingUser = await prisma.user.count({ where: { email } });

  if (existingUser) {
    throw new HttpError(400, 'User already exists');
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  setRedirectHeader(res, '/login');

  return res.sendStatus(204);
};

export default handleRequest(registerUser);

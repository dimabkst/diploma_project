import { Request, Response } from 'express';
import { LogLevel, Prisma } from '@prisma/client';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';

const getLogById = async (req: Request, res: Response) => {
  const existingLog = await prisma.log.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: { id: true },
  });

  if (!existingLog) {
    throw new HttpError(404, 'Log cannot be found');
  }

  const log = await prisma.log.findUnique({
    where: { id: existingLog.id },
  });

  return res.status(200).json(log);
};

export default handleRequest(getLogById);

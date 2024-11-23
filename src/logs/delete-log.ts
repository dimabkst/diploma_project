import { Request, Response } from 'express';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';

const deleteLog = async (req: Request, res: Response) => {
  const existingLog = await prisma.log.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true },
  });

  if (!existingLog) {
    throw new HttpError(404, 'Log cannot be found');
  }

  await prisma.log.delete({
    where: { id: existingLog.id },
    select: { id: true },
  });

  return res.status(204);
};

export default handleRequest(deleteLog);

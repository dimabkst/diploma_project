import { Response } from 'express';
import prisma from '../db';
import { RequestWithUser } from '../utils/types';
import { HttpError } from '../utils/error';
import handleRequest, { checkUserInRequest } from '../utils/request';

const updateTerritory = async (req: RequestWithUser, res: Response) => {
  checkUserInRequest(req.user);

  const territory = await prisma.territory.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: {
      id: true,
    },
  });

  if (!territory) {
    throw new HttpError(404, 'Territory cannot be found');
  }

  const updated = await prisma.territory.update({
    where: {
      id: territory.id,
    },
    data: {
      name: req.body.name,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return res.status(200).json(updated);
};

export default handleRequest(updateTerritory);

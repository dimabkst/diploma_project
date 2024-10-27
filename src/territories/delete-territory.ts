import { Response } from 'express';
import prisma from '../db';
import { RequestWithUser } from '../utils/types';
import { HttpError } from '../utils/error';
import handleRequest, { checkUserInRequest } from '../utils/request';

const deleteTerritory = async (req: RequestWithUser, res: Response) => {
  checkUserInRequest(req.user);

  const territory = await prisma.territory.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!territory) {
    throw new HttpError(404, 'Territory cannot be found');
  }

  if (territory.userId !== req.user.id) {
    throw new HttpError(403, 'Cannot delete this territory');
  }

  const deleted = await prisma.territory.delete({
    where: {
      id: territory.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return res.status(200).json(deleted);
};

export default handleRequest(deleteTerritory);

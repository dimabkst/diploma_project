import { Response } from 'express';
import prisma from '../db';
import { ICreateTerritoryPayload } from './types';
import { RequestWithUserAndBody } from '../utils/types';
import { HttpError } from '../utils/error';
import handleRequest, { checkUserInRequest } from '../utils/request';

const createTerritory = async (req: RequestWithUserAndBody<ICreateTerritoryPayload>, res: Response) => {
  checkUserInRequest(req.user);

  const existingTerritory = await prisma.territory.findUnique({
    where: {
      userId_name: {
        userId: req.user.id,
        name: req.body.name,
      },
    },
    select: { id: true },
  });

  if (existingTerritory) {
    throw new HttpError(400, 'Territory already exists');
  }

  const territory = await prisma.territory.create({
    data: {
      userId: req.user.id,
      name: req.body.name,
    },
    select: {
      id: true,
      name: true,
    },
  });

  return res.status(201).json(territory);
};

export default handleRequest(createTerritory);

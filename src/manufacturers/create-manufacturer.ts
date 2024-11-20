import { Response } from 'express';
import prisma from '../db';
import { ICreateManufacturerPayload } from './types';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';
import { RequestWithUserAndBody } from '../utils/types';

const createManufacturer = async (req: RequestWithUserAndBody<ICreateManufacturerPayload>, res: Response) => {
  const existingManufacturer = await prisma.manufacturer.findUnique({
    where: { name: req.body.name },
    select: { id: true },
  });

  if (existingManufacturer) {
    throw new HttpError(400, 'Manufacturer category already exists');
  }

  await prisma.manufacturer.create({
    data: req.body,
    select: { id: true },
  });

  return res.status(204);
};

export default handleRequest(createManufacturer);

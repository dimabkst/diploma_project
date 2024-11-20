import { Response } from 'express';
import prisma from '../db';
import { IUpdateManufacturerPayload } from './types';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';
import { RequestWithBody } from '../utils/types';

const updateManufacturer = async (req: RequestWithBody<IUpdateManufacturerPayload>, res: Response) => {
  const existingManufacturer = await prisma.manufacturer.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true },
  });

  if (!existingManufacturer) {
    throw new HttpError(404, 'Manufacturer cannot be found');
  }

  await prisma.manufacturer.update({
    where: { id: existingManufacturer.id },
    data: req.body,
    select: { id: true },
  });

  return res.status(204);
};

export default handleRequest(updateManufacturer);

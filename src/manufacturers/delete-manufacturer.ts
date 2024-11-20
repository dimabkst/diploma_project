import { Request, Response } from 'express';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';

const deleteManufacturer = async (req: Request, res: Response) => {
  const existingManufacturer = await prisma.manufacturer.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true },
  });

  if (!existingManufacturer) {
    throw new HttpError(404, 'Manufacturer cannot be found');
  }

  await prisma.manufacturer.delete({
    where: { id: existingManufacturer.id },
    select: { id: true },
  });

  return res.status(204);
};

export default handleRequest(deleteManufacturer);

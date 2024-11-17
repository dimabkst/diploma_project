import { Request, Response } from 'express';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';

const deleteProduct = async (req: Request, res: Response) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: { id: true },
  });

  if (!existingProduct) {
    throw new HttpError(404, 'Product cannot be found');
  }

  await prisma.product.delete({
    where: { id: existingProduct.id },
    select: {
      id: true,
    },
  });

  return res.sendStatus(204);
};

export default handleRequest(deleteProduct);

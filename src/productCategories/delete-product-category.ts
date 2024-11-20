import { Request, Response } from 'express';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';

const deleteProductCategory = async (req: Request, res: Response) => {
  const existingProductCategory = await prisma.productCategory.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true },
  });

  if (!existingProductCategory) {
    throw new HttpError(404, 'Product category cannot be found');
  }

  await prisma.productCategory.delete({
    where: { id: existingProductCategory.id },
    select: { id: true },
  });

  return res.status(204);
};

export default handleRequest(deleteProductCategory);

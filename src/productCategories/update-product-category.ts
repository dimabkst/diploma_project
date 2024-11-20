import { Response } from 'express';
import prisma from '../db';
import { IUpdateProductCategoryPayload } from './types';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';
import { RequestWithBody } from '../utils/types';

const updateProductCategory = async (req: RequestWithBody<IUpdateProductCategoryPayload>, res: Response) => {
  const existingProductCategory = await prisma.productCategory.findUnique({
    where: { id: Number(req.params.id) },
    select: { id: true },
  });

  if (!existingProductCategory) {
    throw new HttpError(404, 'Product category cannot be found');
  }

  await prisma.productCategory.update({
    where: { id: existingProductCategory.id },
    data: req.body,
    select: { id: true },
  });

  return res.status(204);
};

export default handleRequest(updateProductCategory);

import { Response } from 'express';
import prisma from '../db';
import { ICreateProductCategoryPayload } from './types';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';
import { RequestWithBody } from '../utils/types';

const createProductCategory = async (req: RequestWithBody<ICreateProductCategoryPayload>, res: Response) => {
  const existingProductCategory = await prisma.productCategory.findUnique({
    where: { name: req.body.name },
    select: { id: true },
  });

  if (existingProductCategory) {
    throw new HttpError(400, 'Product category already exists');
  }

  await prisma.productCategory.create({
    data: req.body,
    select: { id: true },
  });

  return res.status(204);
};

export default handleRequest(createProductCategory);

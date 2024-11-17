import { Response } from 'express';
import { ICreateProductPayload } from './types';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';
import { RequestWithBody } from '../utils/types';

const createProduct = async (req: RequestWithBody<ICreateProductPayload>, res: Response) => {
  if (req.body.manufacturerId) {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: req.body.manufacturerId },
      select: { id: true },
    });

    if (!manufacturer) {
      throw new HttpError(404, 'Manufacturer cannot be found');
    }
  }

  if (req.body.productCategoryId) {
    const productCategory = await prisma.productCategory.findUnique({
      where: { id: req.body.productCategoryId },
      select: { id: true },
    });

    if (!productCategory) {
      throw new HttpError(404, 'Product category cannot be found');
    }
  }

  await prisma.product.create({
    data: req.body,
    select: {
      id: true,
    },
  });

  return res.sendStatus(204);
};

export default handleRequest(createProduct);

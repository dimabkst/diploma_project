import { Response } from 'express';
import { IUpdateProductPayload } from './types';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest from '../utils/request';
import { RequestWithBody } from '../utils/types';

const updateProduct = async (req: RequestWithBody<IUpdateProductPayload>, res: Response) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: Number(req.params.id),
    },
    select: { id: true },
  });

  if (!existingProduct) {
    throw new HttpError(404, 'Product cannot be found');
  }

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

  await prisma.product.update({
    where: { id: existingProduct.id },
    data: req.body,
    select: {
      id: true,
    },
  });

  return res.sendStatus(204);
};

export default handleRequest(updateProduct);

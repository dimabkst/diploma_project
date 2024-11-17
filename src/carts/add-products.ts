import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { IAddProductsPayload } from './types';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest, { checkUserInRequest } from '../utils/request';
import { RequestWithUserAndBody } from '../utils/types';

const addProducts = async (req: RequestWithUserAndBody<IAddProductsPayload[]>, res: Response) => {
  checkUserInRequest(req.user);

  const productIds = req.body.map((b) => b.productId);

  const productsCount = await prisma.product.count({
    where: {
      id: { in: productIds },
    },
  });

  if (productsCount !== req.body.length) {
    throw new HttpError(404, productIds.length === 1 ? 'Product cannot be found' : 'Some products cannot be found');
  }

  const cartProduct = await prisma.cartProduct.findFirst({
    where: {
      cart: { userId: req.user.id },
      productId: { in: productIds },
    },
    select: { id: true },
  });

  if (cartProduct) {
    throw new HttpError(400, productIds.length === 1 ? 'Product is already in cart' : 'Some products are already in cart');
  }

  const cartProductsPayload: Prisma.CartProductCreateManyCartInput[] = req.body.map((b) => ({
    quantity: b.quantity || 1,
    productId: b.productId,
  }));

  await prisma.cart.upsert({
    where: {
      userId: req.user.id,
    },
    update: {
      cartProducts: {
        createMany: {
          data: cartProductsPayload,
        },
      },
    },
    create: {
      userId: req.user.id,
      cartProducts: {
        createMany: {
          data: cartProductsPayload,
        },
      },
    },
    select: { id: true },
  });

  return res.sendStatus(201);
};

export default handleRequest(addProducts);

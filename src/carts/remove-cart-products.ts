import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { assignCartTotalAmountInfo } from './services';
import { IRemoveCartProductsPayload } from './types';
import { cartView } from './views';
import prisma from '../db';
import { HttpError } from '../utils/error';
import handleRequest, { checkUserInRequest } from '../utils/request';
import { RequestWithUserAndBody } from '../utils/types';

const removeCartProducts = async (req: RequestWithUserAndBody<IRemoveCartProductsPayload>, res: Response) => {
  checkUserInRequest(req.user);

  let cartProductsWhereInput: Prisma.CartProductWhereInput | undefined;

  if (req.body.removeAll) {
    cartProductsWhereInput = {};
  } else if (req.body.cartProductIds?.length) {
    const cartProductsCount = await prisma.cartProduct.count({
      where: {
        id: { in: req.body.cartProductIds },
      },
    });

    if (cartProductsCount !== req.body.cartProductIds.length) {
      throw new HttpError(404, 'Some cart products cannot be found');
    }

    cartProductsWhereInput = { id: { in: req.body.cartProductIds } };
  } else if (req.body.productIds?.length) {
    const cartProductsCount = await prisma.cartProduct.count({
      where: {
        productId: { in: req.body.productIds },
      },
    });

    if (cartProductsCount !== req.body.productIds.length) {
      throw new HttpError(404, 'Some cart products cannot be found');
    }

    cartProductsWhereInput = { productId: { in: req.body.productIds } };
  }

  const cart = await prisma.cart.upsert({
    where: { userId: req.user.id },
    update: {
      cartProducts: cartProductsWhereInput
        ? {
            deleteMany: cartProductsWhereInput,
          }
        : undefined,
    },
    create: { userId: req.user.id },
    select: cartView,
  });

  assignCartTotalAmountInfo(cart);

  return res.status(200).json(cart);
};

export default handleRequest(removeCartProducts);

import { Response } from 'express';
import prisma, { transacting } from '../db';
import { omit } from '../utils/data';
import { HttpError } from '../utils/error';
import handleRequest, { checkUserInRequest } from '../utils/request';
import { RequestWithUser } from '../utils/types';
import { assignCartTotalAmountInfo } from '../carts/services';

const createOrder = async (req: RequestWithUser, res: Response) => {
  checkUserInRequest(req.user);

  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      cartProducts: {
        select: {
          quantity: true,
          product: {
            select: {
              id: true,
              price: true,
              name: true,
              image: true,
              countryOfOrigin: true,
              description: true,
              color: true,
              weight: true,
              size: true,
            },
          },
        },
      },
    },
  });

  if (!cart || !cart.cartProducts.length) {
    throw new HttpError(400, 'Cannot create order without products');
  }

  assignCartTotalAmountInfo(cart);

  await transacting(prisma, async (prisma) => {
    await prisma.order.create({
      data: {
        totalAmount: cart.totalAmount,
        userId,
        products: {
          createMany: {
            data: cart.cartProducts.map((cp) => ({
              ...omit(cp.product, 'id'),
              productId: cp.product.id,
              quantity: cp.quantity,
            })),
          },
        },
      },
      select: {
        id: true,
      },
    });

    await prisma.cartProduct.deleteMany({
      where: {
        cartId: cart.id,
      },
    });
  });

  return res.sendStatus(204);
};

export default handleRequest(createOrder);

import { Response } from 'express';
import { assignCartTotalAmountInfo } from './services';
import { IEditCartProductsPayload } from './types';
import { cartView } from './views';
import prisma, { transacting } from '../db';
import { HttpError } from '../utils/error';
import handleRequest, { checkUserInRequest } from '../utils/request';
import { RequestWithUserAndBody } from '../utils/types';

const editCartProducts = async (req: RequestWithUserAndBody<IEditCartProductsPayload[]>, res: Response) => {
  checkUserInRequest(req.user);

  if (req.body?.length) {
    const cartProductsCount = await prisma.cartProduct.count({
      where: { id: { in: req.body.map((pd) => pd.cartProductId) } },
    });

    if (cartProductsCount !== req.body.length) {
      throw new HttpError(404, 'Some cart products cannot be found');
    }
  }

  const userId = req.user.id;

  const cart = await transacting(prisma, async (prisma) => {
    if (req.body?.length) {
      await Promise.all(
        req.body.map((cpd) =>
          prisma.cartProduct.update({ where: { id: cpd.cartProductId }, data: { quantity: cpd.quantity }, select: { id: true } })
        )
      );
    }

    return prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select: cartView,
    });
  });

  assignCartTotalAmountInfo(cart);

  return res.status(200).json(cart);
};

export default handleRequest(editCartProducts);

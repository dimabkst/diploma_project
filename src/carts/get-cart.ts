import { Response } from 'express';
import { cartView } from './views';
import prisma from '../db';
import handleRequest, { checkUserInRequest } from '../utils/request';
import { RequestWithUser } from '../utils/types';
import { assignCartTotalAmountInfo } from './services';

const getCart = async (req: RequestWithUser, res: Response) => {
  checkUserInRequest(req.user);

  const cart = await prisma.cart.upsert({
    where: { userId: req.user.id },
    update: {},
    create: { userId: req.user.id },
    select: cartView,
  });

  assignCartTotalAmountInfo(cart);

  return res.status(200).json(cart);
};

export default handleRequest(getCart);

import { Response } from 'express';
import { Prisma, UserRole } from '@prisma/client';
import { IGetOrdersQuery } from './types';
import prisma from '../db';
import { offsetPaginate } from '../utils/pagination';
import handleRequest, { checkUserInRequest } from '../utils/request';
import { RequestWithUser } from '../utils/types';

const getOrders = async (req: RequestWithUser<IGetOrdersQuery>, res: Response) => {
  checkUserInRequest(req.user);

  const pagination = offsetPaginate(req.query.limit, req.query.page);

  const filter: Prisma.OrderWhereInput = {
    userId: req.user.role === UserRole.USER ? req.user.id : undefined,
  };

  const [count, orders] = await Promise.all([
    prisma.order.count({
      where: filter,
    }),
    prisma.order.findMany({
      where: filter,
      select: { id: true, status: true, totalAmount: true, createdAt: true },
      ...pagination,
      orderBy: [{ id: req.query.sort_by_order_date || 'asc' }],
    }),
  ]);

  return res.status(200).json({ count, orders });
};

export default handleRequest(getOrders);

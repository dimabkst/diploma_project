import { Request, Response } from 'express';
import prisma from '../db';
import handleRequest from '../utils/request';

const getProductCategories = async (req: Request, res: Response) => {
  const [count, productCategories] = await Promise.all([
    prisma.productCategory.count(),
    prisma.productCategory.findMany({
      select: { id: true, name: true, _count: { select: { products: true } } },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    }),
  ]);

  return res.status(200).json({ count, productCategories });
};

export default handleRequest(getProductCategories);

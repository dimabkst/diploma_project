import { Request, Response } from 'express';
import prisma from '../db';
import handleRequest from '../utils/request';

const getProductCategories = async (req: Request, res: Response) => {
  const countQuery = prisma.productCategory.count();
  const getQuery = prisma.productCategory.findMany({
    select: { id: true, name: true, _count: { select: { products: true } } },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });

  const [count, productCategories] = await Promise.all([countQuery, getQuery]);

  return res.status(200).json({ count, productCategories });
};

export default handleRequest(getProductCategories);

import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { IGetProductsQuery } from './types';
import prisma from '../db';
import { offsetPaginate } from '../utils/pagination';
import handleRequest from '../utils/request';
import searchPayload from '../utils/search';
import { RequestWithQuery } from '../utils/types';

export const getProductsService = async (req: RequestWithQuery<IGetProductsQuery>) => {
  const pagination = offsetPaginate(req.query.limit, req.query.page);

  const filter: Prisma.ProductWhereInput = {};

  if (req.query.search) {
    filter.name = searchPayload(req.query.search);
  }

  const countQuery = prisma.product.count({
    where: filter,
  });

  const getQuery = prisma.product.findMany({
    where: filter,
    select: { id: true, name: true, description: true, price: true },
    ...pagination,
    orderBy: [{ name: req.query.sort_name || 'asc' }, { id: 'asc' }],
  });

  const [count, products] = await Promise.all([countQuery, getQuery]);

  return { count, products };
};

const getProducts = async (req: RequestWithQuery<IGetProductsQuery>, res: Response) => {
  const result = await getProductsService(req);
  return res.status(200).json(result);
};

export default handleRequest(getProducts);

import prisma from '../db';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { IGetTerritoriesQuery } from './types';
import { RequestWithUser } from '../utils/types';
import searchPayload from '../utils/search';
import { offsetPaginate } from '../utils/pagination';
import handleRequest, { checkUserInRequest } from '../utils/request';

const getTerritories = async (req: RequestWithUser<IGetTerritoriesQuery>, res: Response) => {
  checkUserInRequest(req.user);

  const pagination = offsetPaginate(req.query.limit, req.query.page);

  const filter: Prisma.TerritoryWhereInput = {};

  if (req.query.search) {
    filter.name = searchPayload(req.query.search);
  }

  const countQuery = prisma.territory.count({
    where: filter,
  });

  const getQuery = prisma.territory.findMany({
    where: filter,
    select: { id: true, name: true },
    ...pagination,
    orderBy: [{ name: req.query.sort_name || 'asc' }, { id: 'asc' }],
  });

  const [count, territories] = await Promise.all([countQuery, getQuery]);

  return res.status(200).json({ count, territories });
};

export default handleRequest(getTerritories);

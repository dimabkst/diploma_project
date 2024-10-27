import prisma from '../db';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { IGetTerritoriesQuery } from './types';
import { RequestWithUser } from '../utils/types';
import searchPayload from '../utils/search';
import handleRequest, { checkUserInRequest } from '../utils/request';
import { cursorPaginate } from '../utils/pagination';

const getTerritories = async (req: RequestWithUser<IGetTerritoriesQuery>, res: Response) => {
  checkUserInRequest(req.user);

  const pagination = cursorPaginate(req.query.limit, req.query.cursor);

  const filter: Prisma.TerritoryWhereInput = {
    userId: req.user.id,
  };

  if (req.query.search) {
    filter.name = searchPayload(req.query.search);
  }

  const countQuery = prisma.territory.count({
    where: filter,
  });

  const getQuery = prisma.territory.findMany({
    where: filter,
    select: { id: true, name: true, _count: { select: { customer: true } } },
    ...pagination,
    orderBy: [{ name: req.query.sort_name || 'asc' }, { id: 'asc' }],
  });

  const [count, territories] = await Promise.all([countQuery, getQuery]);

  return res.status(200).json({ count, territories });
};

export default handleRequest(getTerritories);

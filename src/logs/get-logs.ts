import { Response } from 'express';
import { LogLevel, Prisma } from '@prisma/client';
import { IGetLogsQuery } from './types';
import prisma from '../db';
import { offsetPaginate } from '../utils/pagination';
import handleRequest from '../utils/request';
import { RequestWithQuery } from '../utils/types';

const getLogs = async (req: RequestWithQuery<IGetLogsQuery>, res: Response) => {
  const logsFilter: Prisma.LogWhereInput = {
    level: req.query.level ? LogLevel[req.query.level.toUpperCase() as LogLevel] : undefined,
    status: req.query.status ? Number(req.query.status) : undefined,
  };

  if (req.query.method || req.query.base_url) {
    logsFilter.AND = [];

    if (req.query.method) {
      logsFilter.AND.push({
        context: {
          path: ['method'],
          string_contains: req.query.method?.toUpperCase(),
        },
      });
    }

    if (req.query.base_url) {
      logsFilter.AND.push({
        context: {
          path: ['url'],
          string_contains: req.query.base_url,
        },
      });
    }
  }

  const pagination = offsetPaginate(req.query.limit, req.query.page);

  const sorting: Prisma.LogOrderByWithRelationInput = {};

  if (req.query.sort_date) {
    sorting.timestamp = req.query.sort_date;
  } else if (req.query.sort_status) {
    sorting.status = req.query.sort_status;
  } else {
    sorting.timestamp = 'desc';
  }

  const [count, logs] = await Promise.all([
    prisma.log.count({
      where: logsFilter,
    }),
    prisma.log.findMany({
      where: logsFilter,
      ...pagination,
      orderBy: sorting,
    }),
  ]);

  return res.status(200).json({ count, logs });
};

export default handleRequest(getLogs);

import { Request, Response } from 'express';
import prisma from '../db';
import handleRequest from '../utils/request';

const getManufacturers = async (req: Request, res: Response) => {
  const countQuery = prisma.manufacturer.count();
  const getQuery = prisma.manufacturer.findMany({
    select: { id: true, name: true, _count: { select: { products: true } } },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });

  const [count, manufacturers] = await Promise.all([countQuery, getQuery]);

  return res.status(200).json({ count, manufacturers });
};

export default handleRequest(getManufacturers);

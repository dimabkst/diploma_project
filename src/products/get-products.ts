import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { IGetProductsQuery } from './types';
import prisma from '../db';
import { offsetPaginate } from '../utils/pagination';
import handleRequest from '../utils/request';
import searchPayload from '../utils/search';
import { RequestWithQuery } from '../utils/types';

const getProducts = async (req: RequestWithQuery<IGetProductsQuery>, res: Response) => {
  const pagination = offsetPaginate(req.query.limit, req.query.page);

  const filter: Prisma.ProductWhereInput = {};

  if (req.query.category_ids?.length) {
    filter.productCategoryId = { in: req.query.category_ids };
  }
  if (req.query.category_id) {
    filter.productCategoryId = Number(req.query.category_id);
  }

  if (req.query.manufacturer_ids?.length) {
    filter.manufacturerId = { in: req.query.manufacturer_ids };
  }
  if (req.query.manufacturer_id) {
    filter.manufacturerId = Number(req.query.manufacturer_id);
  }

  if (req.query.countries_of_origin?.length) {
    filter.countryOfOrigin = { in: req.query.countries_of_origin };
  }
  if (req.query.country_of_origin) {
    filter.countryOfOrigin = req.query.country_of_origin;
  }

  if (req.query.price_gte || req.query.price_lte) {
    filter.AND = [];

    if (req.query.price_gte) {
      filter.AND.push({ price: { gte: Number(req.query.price_gte) } });
    }
    if (req.query.price_lte) {
      filter.AND.push({ price: { lte: Number(req.query.price_lte) } });
    }
  }

  if (req.query.search) {
    filter.name = searchPayload(req.query.search);
  }

  const [count, products] = await Promise.all([
    prisma.product.count({
      where: filter,
    }),
    prisma.product.findMany({
      where: filter,
      select: { id: true, name: true, price: true, image: true },
      ...pagination,
      orderBy: [{ name: req.query.sort_name || 'asc' }, { id: 'asc' }],
    }),
  ]);

  return res.status(200).json({ count, products });
};

export default handleRequest(getProducts);

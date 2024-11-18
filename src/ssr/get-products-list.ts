import { Request, Response } from 'express';
import handleRequest from '../utils/request';
import { getProductsService } from '../products/get-products';

const getProductsList = async (req: Request, res: Response) => {
  const productsData = await getProductsService(req);

  const page = Number(req.query.page);
  const totalPages = req.query.limit ? Math.ceil(productsData.count / Number(req.query.limit)) : 1;

  return res.render('products-list', {
    products: productsData.products,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  });
};

export default handleRequest(getProductsList);

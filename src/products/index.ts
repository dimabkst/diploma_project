import { Router } from 'express';
import createProduct from './create-product';
import getProducts from './get-products';
import updateProduct from './update-product';
import deleteProduct from './delete-product';
import { createSchema, deleteSchema, getSchema, updateSchema } from './schemas';
import validation from '../utils/joi';
import { checkAuth } from '../auth/services';

const products: Router = Router();

export const getProductsMiddlewares = [checkAuth(), validation(getSchema)];

products.post('/', checkAuth({ superAdminOnly: true }), validation(createSchema), createProduct);
products.get('/', ...getProductsMiddlewares, getProducts);
products.put('/:id', checkAuth({ superAdminOnly: true }), validation(updateSchema), updateProduct);
products.delete('/:id', checkAuth({ superAdminOnly: true }), validation(deleteSchema), deleteProduct);

export default products;

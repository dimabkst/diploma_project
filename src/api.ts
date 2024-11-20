import { Router } from 'express';
import auth from './auth';
import products from './products';
import carts from './carts';
import orders from './orders';
import manufacturers from './manufacturers';
import productCategories from './productCategories';

const api: Router = Router();

api.use('/auth', auth);
api.use('/products', products);
api.use('/carts', carts);
api.use('/orders', orders);
api.use('/manufacturers', manufacturers);
api.use('/product-categories', productCategories);

export default api;

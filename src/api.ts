import { Router } from 'express';
import auth from './auth';
import carts from './carts';
import manufacturers from './manufacturers';
import orders from './orders';
import products from './products';
import productCategories from './productCategories';
import logs from './logs';

const api: Router = Router();

api.use('/auth', auth);
api.use('/carts', carts);
api.use('/manufacturers', manufacturers);
api.use('/orders', orders);
api.use('/products', products);
api.use('/product-categories', productCategories);
api.use('/logs', logs);

export default api;

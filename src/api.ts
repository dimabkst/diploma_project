import { Router } from 'express';
import auth from './auth';
import products from './products';
import carts from './carts';
import orders from './orders';

const api: Router = Router();

api.use('/auth', auth);
api.use('/products', products);
api.use('/carts', carts);
api.use('/orders', orders);

export default api;

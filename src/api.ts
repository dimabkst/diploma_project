import { Router } from 'express';
import auth from './auth';
import territories from './territories';
import products from './products';
import carts from './carts';
import orders from './orders';

const api: Router = Router();

api.use('/auth', auth);
api.use('/territories', territories);
api.use('/products', products);
api.use('/carts', carts);
api.use('/orders', orders);

export default api;

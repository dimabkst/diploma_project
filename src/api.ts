import { Router } from 'express';
import territories from './territories';
import products from './products';
import carts from './carts';

const api: Router = Router();

api.use('/territories', territories);
api.use('/products', products);
api.use('/carts', carts);

export default api;

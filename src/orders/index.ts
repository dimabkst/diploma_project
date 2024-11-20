import { Router } from 'express';
import createOrder from './create-order';
import getOrders from './get-orders';
import { getSchema } from './schemas';
import validation from '../utils/joi';
import { checkAuth } from '../auth/services';

const orders: Router = Router();

orders.post('/', checkAuth(), createOrder);
orders.get('/', checkAuth(), validation(getSchema), getOrders);

export default orders;

import { Router } from 'express';
import validation from '../utils/joi';
import { checkAuth } from '../auth/services';
import addProducts from './add-products';
import getCart from './get-cart';
import editCartProducts from './edit-cart-products';
import removeCartProducts from './remove-cart-products';
import { addProductsSchema, editCartProductsSchema, removeCartProductsSchema } from './schemas';

const carts: Router = Router();

carts.post('/', checkAuth(), validation(addProductsSchema), addProducts);
carts.get('/', checkAuth(), getCart);
carts.put('/', checkAuth(), validation(editCartProductsSchema), editCartProducts);
carts.delete('/', checkAuth(), validation(removeCartProductsSchema), removeCartProducts);

export default carts;

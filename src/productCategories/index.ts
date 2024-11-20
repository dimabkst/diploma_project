import { Router } from 'express';
import createProductCategory from './create-product-category';
import getProductCategories from './get-product-categories';
import updateProductCategory from './update-product-category';
import deleteProductCategory from './delete-product-category';
import { createSchema, deleteSchema, updateSchema } from './schemas';
import validation from '../utils/joi';
import { checkAuth } from '../auth/services';

const productCategories: Router = Router();

productCategories.post('/', checkAuth({ superAdminOnly: true }), validation(createSchema), createProductCategory);
productCategories.get('/', checkAuth(), getProductCategories);
productCategories.put('/:id', checkAuth({ superAdminOnly: true }), validation(updateSchema), updateProductCategory);
productCategories.delete('/:id', checkAuth({ superAdminOnly: true }), validation(deleteSchema), deleteProductCategory);

export default productCategories;

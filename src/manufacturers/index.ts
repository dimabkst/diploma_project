import { Router } from 'express';
import createManufacturer from './create-manufacturer';
import getManufacturers from './get-manufacturers';
import updateManufacturer from './update-manufacturer';
import deleteManufacturer from './delete-manufacturer';
import { createSchema, deleteSchema, updateSchema } from './schemas';
import validation from '../utils/joi';
import { checkAuth } from '../auth/services';

const manufacturers: Router = Router();

manufacturers.post('/', checkAuth({ superAdminOnly: true }), validation(createSchema), createManufacturer);
manufacturers.get('/', checkAuth(), getManufacturers);
manufacturers.put('/:id', checkAuth({ superAdminOnly: true }), validation(updateSchema), updateManufacturer);
manufacturers.delete('/:id', checkAuth({ superAdminOnly: true }), validation(deleteSchema), deleteManufacturer);

export default manufacturers;

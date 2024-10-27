import { Router } from 'express';
import createTerritory from './create-territory';
import getTerritories from './get-territories';
import updateTerritory from './update-territory';
import deleteTerritory from './delete-territory';
import { createSchema, getSchema, updateSchema, deleteSchema } from './schemas';
import validation from '../utils/joi';
import { checkAuth } from '../auth/services';

const territories: Router = Router();

territories.post('/', checkAuth(), validation(createSchema), createTerritory);
territories.get('/', checkAuth(), validation(getSchema), getTerritories);
territories.put('/:id', checkAuth(), validation(updateSchema), updateTerritory);
territories.delete('/:id', checkAuth(), validation(deleteSchema), deleteTerritory);

export default territories;

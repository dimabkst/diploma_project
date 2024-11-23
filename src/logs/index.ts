import { Router } from 'express';
import getLogs from './get-logs';
import getLogById from './get-log-by-id';
import deleteLog from './delete-log';
import { getSchema, deleteSchema, getByIdSchema } from './schemas';
import validation from '../utils/joi';
import { checkAuth } from '../auth/services';

const logs: Router = Router();

logs.get('/', checkAuth({ superAdminOnly: true }), validation(getSchema), getLogs);
logs.get('/:id', checkAuth({ superAdminOnly: true }), validation(getByIdSchema), getLogById);
logs.delete('/:id', checkAuth({ superAdminOnly: true }), validation(deleteSchema), deleteLog);

export default logs;

import { Router } from 'express';
import getLogs from './get-logs';
import deleteLog from './delete-log';
import { getSchema, deleteSchema } from './schemas';
import validation from '../utils/joi';
import { checkAuth } from '../auth/services';

const logs: Router = Router();

logs.get('/', checkAuth({ superAdminOnly: true }), validation(getSchema), getLogs);
logs.delete('/:id', checkAuth({ superAdminOnly: true }), validation(deleteSchema), deleteLog);

export default logs;

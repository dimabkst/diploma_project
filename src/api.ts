import { Router } from 'express';
import territories from './territories';

const api: Router = Router();

api.use('/territories', territories);

export default api;

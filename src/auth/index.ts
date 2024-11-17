import { Router } from 'express';
import registerUser from './register-user';
import loginUser from './login-user';
import logoutUser from './logout-user';
import { loginUserSchema, registerUserSchema } from './schemas';
import validation from '../utils/joi';

const auth: Router = Router();

auth.post('/register', validation(registerUserSchema), registerUser);
auth.post('/login', validation(loginUserSchema), loginUser);
auth.post('/logout', logoutUser);

export default auth;

import express, { Router } from 'express';
import validation from '../utils/joi';
import getRegistrationPage from './get-registration-page';
import getLoginPage from './get-login-page';
import registerUser from './register-user';
import loginUser from './login-user';
import logoutUser from './logout-user';
import { loginUserSchema, registerUserSchema } from './schemas';
import { checkAuth } from './services';

const auth: Router = express.Router();

auth.get('/register', checkAuth({ allowUnauthenticated: true }), getRegistrationPage);
auth.post('/register', validation(registerUserSchema), registerUser);

auth.get('/login', checkAuth({ allowUnauthenticated: true }), getLoginPage);
auth.post('/login', validation(loginUserSchema), loginUser);

auth.post('/logout', logoutUser);

export default auth;

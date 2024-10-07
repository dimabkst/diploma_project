import express, { Request, Response, Router } from 'express';
import validation from '../utils/joi';
import loginUser from './login-user';
import registerUser from './register-user';
import checkLogin from './check-login';
import { loginUserSchema, registerUserSchema } from './schemas';
import { checkAuth } from './services';

const auth: Router = express.Router();

auth.get('/register', (req: Request, res: Response) => res.render('register'));
auth.post('/register', checkAuth({ allowUnauthenticated: true }), validation(registerUserSchema), registerUser);

auth.get('/login', (req: Request, res: Response) => res.render('login'));
auth.post('/login', checkAuth({ allowUnauthenticated: true }), validation(loginUserSchema), loginUser);

auth.get('/logout', (req: Request, res: Response) => res.redirect('/login'));

auth.get('/check-login', checkAuth({ allowUnauthenticated: true }), checkLogin);

export default auth;

import { Request, Response, Router } from 'express';
import getRegistrationPage from './get-registration-page';
import getLoginPage from './get-login-page';
import getProductsList from './get-products-list';
import { getProductsMiddlewares } from '../products';
import { checkAuth } from '../auth/services';
import { RequestWithUser } from '../utils/types';

const ssr: Router = Router();

ssr.get('/register', checkAuth({ allowUnauthenticated: true }), getRegistrationPage);
ssr.get('/login', checkAuth({ allowUnauthenticated: true }), getLoginPage);
ssr.get('/products', ...getProductsMiddlewares, getProductsList);

// TODO: change this logic or fix multiple renderings on client after redirect to login or remove all ssr routes
// or fix toasts when rerendering page
ssr.get('/', checkAuth({ allowUnauthenticated: true }), (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  return res.render('index');
});

ssr.get('*', (req: Request, res: Response) => {
  return res.render('layout');
});

export default ssr;

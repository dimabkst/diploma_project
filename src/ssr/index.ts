import { Response, Router } from 'express';
import getRegistrationPage from './get-registration-page';
import getLoginPage from './get-login-page';
import { checkAuth } from '../auth/services';
import { RequestWithUser } from '../utils/types';

const ssr: Router = Router();

ssr.get('/register', checkAuth({ allowUnauthenticated: true }), getRegistrationPage);
ssr.get('/login', checkAuth({ allowUnauthenticated: true }), getLoginPage);

ssr.get('/', checkAuth({ allowUnauthenticated: true }), (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  return res.render('index');
});

ssr.get(['/admin', '/admin/*'], checkAuth({ superAdminOnly: true }), (req: RequestWithUser, res: Response) => {
  return res.render('admin-layout');
});

ssr.get('*', checkAuth({ allowUnauthenticated: true }), (req: RequestWithUser, res: Response) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  return res.render('layout');
});

export default ssr;

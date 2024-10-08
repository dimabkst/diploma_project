import { Response } from 'express';
import { RequestWithUser } from '../utils/types';
import { setRedirectHeader } from '../utils/response';

const getLoginPage = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    setRedirectHeader(res, '/');

    return res.sendStatus(204);
  }

  return res.render('register');
};

export default getLoginPage;

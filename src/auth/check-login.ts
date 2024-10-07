import { Response } from 'express';
import { RequestWithUser } from '../utils/types';
import { setRedirectHeader } from '../utils/response';
import handleRequest from '../utils/request';

const checkLogin = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    setRedirectHeader(res, '/');
  }

  // all not authenticated logic is handled in check auth middleware
  res.sendStatus(204);
};

export default handleRequest(checkLogin);

import { Request, Response } from 'express';
import handleRequest from '../utils/request';
import { setRedirectHeader } from '../utils/response';

const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie('token');

  setRedirectHeader(res, '/login');

  return res.sendStatus(204);
};

export default handleRequest(logoutUser);

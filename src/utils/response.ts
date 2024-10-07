import { Response } from 'express';

export const setRedirectHeader = (res: Response, path: string) => res.set('HX-Redirect', path);

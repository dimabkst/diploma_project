import { IHttpErrorMeta } from './types';

export class HttpError extends Error {
  public readonly isHttpError: boolean = true;
  public readonly name: string = 'HttpError';

  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly meta?: IHttpErrorMeta
  ) {
    super();

    Error.captureStackTrace(this, this.constructor);
  }
}

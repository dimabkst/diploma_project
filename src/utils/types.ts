import { Request } from 'express';
import { Query, ParamsDictionary } from 'express-serve-static-core';
import { User } from '@prisma/client';

export interface IHttpErrorMeta extends Record<string, any> {
  message?: void;
}

export type RequestWithQuery<Q = Query> = Request<ParamsDictionary, any, any, Q & Query>;

export interface RequestWithBody<T, Q = Query> extends RequestWithQuery<Q> {
  body: T;
}

export interface RequestWithUser<Q = Query> extends RequestWithQuery<Q> {
  user?: User;
}

export interface RequestWithUserAndBody<T, Q = Query> extends RequestWithUser<Q> {
  body: T;
}

export interface IOffsetPaginationQuery {
  limit?: string;
  page?: string;
}

export interface ICursorPaginationQuery {
  limit?: string;
  cursor?: string;
}

export interface IPagination {
  take?: number;
  skip?: number;
}

export interface ICursorPagination {
  take?: number;
  skip?: number;
  cursor?: any;
}

export type SortQuery = 'asc' | 'desc';

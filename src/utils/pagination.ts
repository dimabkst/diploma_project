import Joi from 'joi';
import { IPagination, ICursorPagination } from './types';

export const offsetPaginationPartialSchema: Joi.PartialSchemaMap = {
  limit: Joi.number().integer().positive().allow(''),
  page: Joi.number().integer().positive().allow(''),
};

export const cursorPaginationPartialSchema: Joi.PartialSchemaMap = {
  limit: Joi.number().integer().positive().allow(''),
  cursor: Joi.number().integer().positive().allow(''), // TODO: change if use string ids etc
};

export const paginate = (limit: number | string | undefined, page: number | string | undefined): IPagination => {
  const pagination: IPagination = {};

  if (limit) {
    Object.assign(pagination, {
      take: Number(limit),
    });
  }

  if (limit && page) {
    Object.assign(pagination, {
      skip: Number(limit) * (Number(page) - 1),
    });
  }

  return pagination;
};

export const cursorPaginate = (limit: number | string | undefined, cursor: number | string | undefined): ICursorPagination => {
  const pagination: ICursorPagination = {};

  if (limit) {
    Object.assign(pagination, {
      take: Number(limit),
    });
  }

  if (cursor) {
    Object.assign(pagination, {
      skip: 1,
      cursor: {
        id: Number(cursor), // TODO: change if use string ids etc
      },
    });
  }

  return pagination;
};

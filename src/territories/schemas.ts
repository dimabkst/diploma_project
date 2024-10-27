import Joi from 'joi';
import { cursorPaginationPartialSchema } from '../utils/pagination';

export const createSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
  }),
});

export const getSchema: Joi.ObjectSchema = Joi.object({
  query: {
    ...cursorPaginationPartialSchema,
    search: Joi.string().optional().allow(''),
    sort_name: Joi.string().valid('asc', 'desc').optional().allow(''),
  },
});

export const updateSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().positive().required(),
  }),
  body: Joi.object({
    name: Joi.string().required(),
  }),
});

export const deleteSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().positive().required(),
  }),
});

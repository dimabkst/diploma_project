import Joi from 'joi';
import { LogLevel } from '@prisma/client';
import { offsetPaginationPartialSchema } from '../utils/pagination';

export const getSchema: Joi.ObjectSchema = Joi.object({
  query: Joi.object({
    ...offsetPaginationPartialSchema,
    level: Joi.string()
      .valid(...Object.values(LogLevel))
      .insensitive()
      .allow(''),
    status: Joi.number().positive().integer().optional().allow(''),
    method: Joi.string().optional().allow(''),
    base_url: Joi.string().optional().allow(''),
    sort_date: Joi.string().valid('asc', 'desc').optional().allow(''),
    sort_status: Joi.string().valid('asc', 'desc').optional().allow(''),
  }),
});

export const deleteSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().positive().integer().required(),
  }),
});

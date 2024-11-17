import Joi from 'joi';
import { offsetPaginationPartialSchema } from '../utils/pagination';

export const createSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().positive().required(),
    active: Joi.boolean().strict().optional(),
    stock: Joi.number().positive().allow(0).optional(),
    countryOfOrigin: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    color: Joi.string().trim().optional(),
    weight: Joi.string().trim().optional(),
    size: Joi.string().trim().optional(),
    manufacturerId: Joi.number().positive().optional(),
    productCategoryId: Joi.number().positive().optional(),
  }),
});

export const getSchema: Joi.ObjectSchema = Joi.object({
  query: {
    ...offsetPaginationPartialSchema,
    search: Joi.string().optional().allow(''),
    sort_name: Joi.string().valid('asc', 'desc').optional().allow(''),
  },
});

export const updateSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({ id: Joi.number().positive().required() }),
  body: Joi.object({
    name: Joi.string().trim().optional(),
    price: Joi.number().positive().optional(),
    active: Joi.boolean().strict().optional(),
    stock: Joi.number().positive().allow(0).optional(),
    countryOfOrigin: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    color: Joi.string().trim().optional(),
    weight: Joi.string().trim().optional(),
    size: Joi.string().trim().optional(),
    manufacturerId: Joi.number().positive().optional(),
    productCategoryId: Joi.number().positive().optional(),
  }),
});

export const deleteSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().positive().required(),
  }),
});

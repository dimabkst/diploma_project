import Joi from 'joi';
import { offsetPaginationPartialSchema } from '../utils/pagination';

export const createSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().required(),
    price: Joi.number().positive().required(),
    active: Joi.boolean().strict().optional(),
    stock: Joi.number().positive().integer().allow(0).optional(),
    image: Joi.string().optional(),
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
    category_id: Joi.number().positive().integer().optional().allow(''),
    category_ids: Joi.array().items(Joi.number().positive().integer()).optional().allow(''),
    manufacturer_id: Joi.number().positive().integer().optional().allow(''),
    manufacturer_ids: Joi.array().items(Joi.number().positive().integer()).optional().allow(''),
    country_of_origin: Joi.string().optional().allow(''),
    countries_of_origin: Joi.array().items(Joi.string()).optional().allow(''),
    price_gte: Joi.number().positive().allow(0).optional().allow(''),
    price_lte: Joi.number().positive().allow(0).optional().allow(''),
    search: Joi.string().optional().allow(''),
    sort_name: Joi.string().valid('asc', 'desc').optional().allow(''),
  },
});

export const updateSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({ id: Joi.number().positive().integer().required() }),
  body: Joi.object({
    name: Joi.string().trim().optional(),
    price: Joi.number().positive().optional(),
    active: Joi.boolean().strict().optional(),
    stock: Joi.number().positive().integer().allow(0).optional(),
    image: Joi.string().optional(),
    countryOfOrigin: Joi.string().trim().optional(),
    description: Joi.string().trim().optional(),
    color: Joi.string().trim().optional(),
    weight: Joi.string().trim().optional(),
    size: Joi.string().trim().optional(),
    manufacturerId: Joi.number().positive().integer().optional(),
    productCategoryId: Joi.number().positive().integer().optional(),
  }),
});

export const deleteSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().positive().integer().required(),
  }),
});

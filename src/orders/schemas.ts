import Joi from 'joi';
import { offsetPaginationPartialSchema } from '../utils/pagination';

export const getSchema: Joi.ObjectSchema = Joi.object({
  query: {
    ...offsetPaginationPartialSchema,
    sort_by_order_date: Joi.string().valid('asc', 'desc').optional().allow(''),
  },
});

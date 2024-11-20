import Joi from 'joi';

export const createSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().trim().required(),
  }),
});

export const updateSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().positive().integer().required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().optional(),
  }),
});

export const deleteSchema: Joi.ObjectSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().positive().integer().required(),
  }),
});

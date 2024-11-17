import Joi from 'joi';

export const addProductsSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.array().items(
    Joi.object({
      productId: Joi.number().strict().positive().required(),
      quantity: Joi.number().strict().positive().optional(),
    })
  ),
});

export const removeCartProductsSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    cartProductIds: Joi.array().items(Joi.number().strict().positive().required()).optional(),
    removeAll: Joi.boolean().strict().optional(),
  }),
});

export const editCartProductsSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.array()
    .items(
      Joi.object({
        cartProductId: Joi.number().strict().positive().required(),
        quantity: Joi.number().strict().positive().required(),
      })
    )
    .optional(),
});

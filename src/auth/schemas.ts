import Joi from 'joi';
import { joiPasswordExtendCore, JoiPasswordExtend } from 'joi-password';

const joiPassword: JoiPasswordExtend = Joi.extend(joiPasswordExtendCore);

export const password = joiPassword.string().min(8).minOfUppercase(1).minOfNumeric(1).required();

export const loginUserSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    password,
    rememberMe: Joi.boolean().optional().allow(null),
  }),
});

export const registerUserSchema: Joi.ObjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: false }).required(),
    password,
    repeatPassword: password,
  }),
});

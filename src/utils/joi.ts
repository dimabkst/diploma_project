import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

// middleware for validation using Joi
const validation = (schema: Joi.ObjectSchema) => {
  const extendedSchema = schema.unknown();

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await extendedSchema.validateAsync(req, { errors: { label: 'key', wrap: { label: false } } });

      next();
    } catch (e) {
      if ((e as any).isJoi) {
        return res.status(422).json({
          message: (e as Error).message,
        });
      }

      return res.sendStatus(500);
    }
  };
};

export default validation;

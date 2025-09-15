import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ZodRequestValidationError } from '../errors/zod-request-validation.error';

export function validateRequest(schema: AnyZodObject) {

  return (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      throw new ZodRequestValidationError(result.error);
    }

    next();

  };

}



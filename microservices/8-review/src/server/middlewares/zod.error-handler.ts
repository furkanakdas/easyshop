import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ZodRequestValidationError } from "../errors/zod-request-validation.error";





export const zodErrorHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {

  
  console.log(err.stack);
  
  if (err instanceof ZodError) {
    return next(new ZodRequestValidationError(err));
  }
  next(err); // Diğer hatalar zincirde ilerlesin
};
import { ErrorSchema} from "./error-schema";
import { StatusCodes } from 'http-status-codes';
import { ErrorStatus } from "../enums/error-status";

export abstract class CustomError extends Error {

  abstract httpStatus:number;

  errorShema:ErrorSchema;

  constructor(customErrorOptions:ErrorSchema) {

    super(customErrorOptions.message);

    this.errorShema = customErrorOptions
    

    Object.setPrototypeOf(this, CustomError.prototype);
  }

   serializeErrors(): ErrorSchema{

      return this.errorShema;

   };
}
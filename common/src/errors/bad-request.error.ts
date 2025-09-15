import { CustomError } from './custom.error';
import { StatusCodes } from 'http-status-codes';
import { ErrorStatus } from '../enums/error-status';
import { ErrorSchema } from './error-schema';

export class BadRequestError extends CustomError {

  httpStatus: number;

  constructor({
    message = "Bad Request Error",
    httpStatus = StatusCodes.BAD_REQUEST,
    status = ErrorStatus.ERROR,
    ...rest 
  }: ErrorSchema) {

    super({ message, httpStatus, status, ...rest });
    
    this.httpStatus = httpStatus;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }


}
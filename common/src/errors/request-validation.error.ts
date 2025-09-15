import { CustomError } from './custom.error';
import { StatusCodes } from 'http-status-codes';
import { ErrorStatus } from '../enums/error-status';
import { ErrorSchema } from './error-schema';

export class RequestValidationError extends CustomError {

  httpStatus: number;

  constructor({
    message = "Request Validation Error",
    httpStatus = StatusCodes.BAD_REQUEST,
    status = ErrorStatus.ERROR,
    ...rest 
  }: ErrorSchema) {

    super({ message, httpStatus, status, ...rest });
    
    this.httpStatus = httpStatus;

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }


}

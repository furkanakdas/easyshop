import { CustomError } from './custom.error';
import { StatusCodes } from 'http-status-codes';
import { ErrorStatus } from '../enums/error-status';
import { ErrorSchema } from './error-schema';

export class NotFoundError extends CustomError {

  httpStatus: number;

  constructor({
    message = "Not Found",
    httpStatus = StatusCodes.NOT_FOUND,
    status = ErrorStatus.ERROR,
    ...rest 
  }: ErrorSchema) {

    super({ message, httpStatus, status, ...rest });
    
    this.httpStatus = httpStatus;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }


}


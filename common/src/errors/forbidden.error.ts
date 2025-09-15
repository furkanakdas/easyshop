import { CustomError } from './custom.error';
import { StatusCodes } from 'http-status-codes';
import { ErrorStatus } from '../enums/error-status';
import { ErrorSchema } from './error-schema';

export class ForbiddenError extends CustomError {

  httpStatus: number;

  constructor({
    message = "You do not have required permissions",
    httpStatus = StatusCodes.FORBIDDEN,
    status = ErrorStatus.ERROR,
    ...rest 
  }: ErrorSchema) {

    super({ message, httpStatus, status, ...rest });
    
    this.httpStatus = httpStatus;

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

}

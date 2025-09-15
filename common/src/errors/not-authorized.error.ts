import { CustomError } from './custom.error';
import { StatusCodes } from 'http-status-codes';
import { ErrorStatus } from '../enums/error-status';
import { ErrorSchema } from './error-schema';

export class NotAuthorizedError extends CustomError {

  httpStatus: number;

  constructor({
    message = "Not Authorized",
    httpStatus = StatusCodes.UNAUTHORIZED,
    status = ErrorStatus.ERROR,
    ...rest 
  }: ErrorSchema) {

    super({ message, httpStatus, status, ...rest });
    
    this.httpStatus = httpStatus;

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

}

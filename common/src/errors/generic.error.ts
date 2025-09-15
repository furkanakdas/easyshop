import { CustomError } from './custom.error';
import { StatusCodes } from 'http-status-codes';
import { ErrorStatus } from '../enums/error-status';
import { ErrorSchema } from './error-schema';

export class GenericError extends CustomError {

  httpStatus: number;

  constructor({
    httpStatus=StatusCodes.BAD_REQUEST,
    status = ErrorStatus.ERROR,
    ...rest 
  }: ErrorSchema) {

    super({ httpStatus, status, ...rest });
    
    this.httpStatus = httpStatus;

    Object.setPrototypeOf(this, GenericError.prototype);
  }


}

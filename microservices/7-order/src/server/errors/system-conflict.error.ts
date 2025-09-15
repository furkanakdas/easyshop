

import { CustomError, ErrorSchema, ErrorStatus, RequestValidationError } from '@faeasyshop/common';
import { StatusCodes } from 'http-status-codes';


export class SystemConflictError  extends CustomError  {

  httpStatus: number;

  constructor({
    message = "System Conflict",
    httpStatus = StatusCodes.CONFLICT,
    status = ErrorStatus.ERROR,
    ...rest 
  }: ErrorSchema) {

    super({ message, httpStatus, status, ...rest });
    
    this.httpStatus = httpStatus;

    Object.setPrototypeOf(this, SystemConflictError.prototype);
  }
}







import { ErrorSchema, ErrorStatus, RequestValidationError } from '@faeasyshop/common';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodErrorMap } from 'zod';


export class ZodRequestValidationError  extends RequestValidationError  {
  constructor(error:ZodError) {
    super({message:error.errors[0].message,field:error.issues[0].path.toString()});
  }
}


import { CustomError, ErrorSchema, ErrorStatus, RequestValidationError } from '@faeasyshop/common';
import { StatusCodes } from 'http-status-codes';
import { ZodError, ZodErrorMap } from 'zod';


export class WebhookError extends CustomError {

    httpStatus: number;



    constructor({ message = "Webhook error, invalid raw event",
        httpStatus = StatusCodes.BAD_REQUEST,
        status = ErrorStatus.ERROR,
        ...rest }: ErrorSchema) {

        super({ message, httpStatus, status, ...rest });

        this.httpStatus = httpStatus;

        Object.setPrototypeOf(this, WebhookError.prototype);

    }
}
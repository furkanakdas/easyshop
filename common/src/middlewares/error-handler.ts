import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { CustomError } from '../errors/custom.error';
import { StatusCodes } from 'http-status-codes';
import { loggerWrapper } from '../logger/loggerWrapper';
import { ErrorStatus } from '../enums/error-status';
import { ErrorSchema } from '../errors/error-schema';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    const serializedError = err.serializeErrors();

    if (!serializedError.path) {
      serializedError.path = req.path;
    }

    if (!serializedError.timestamp) {
      serializedError.timestamp = new Date().toISOString()
    }

    if (!serializedError.comingFrom) {
      serializedError.comingFrom = err.stack?.split('\n')[1]?.trim();
    }

      loggerWrapper.error(err);

    if (serializedError.httpStatus) {
      res.status(serializedError.httpStatus).json({ error: serializedError });
    }else{
      res.status(400).json({ error: serializedError });
    }


    return;
  }


  loggerWrapper.error(err);

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: {
      message: "something went wrong",
      httpStatus: StatusCodes.INTERNAL_SERVER_ERROR,
      status: ErrorStatus.ERROR,
      comingFrom: err.stack?.split('\n')[1]?.trim(),
      timestamp: new Date().toISOString(),
      path: req.path,
    } satisfies ErrorSchema
  });
};

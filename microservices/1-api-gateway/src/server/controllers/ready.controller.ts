import { loggerWrapper } from "@faeasyshop/common";
import { Request, Response } from "express";

import {StatusCodes} from 'http-status-codes';

export function readyController(req:Request,res:Response){

    res.status(StatusCodes.OK).json({ status: 'ok' })
}
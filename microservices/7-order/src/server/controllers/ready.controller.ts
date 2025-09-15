import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import { loggerWrapper } from "@faeasyshop/common";
import { checkDatabaseConnection } from "../../orm/repositories";





export async function readyController(req: Request, res: Response) {

    const dbConnected = await checkDatabaseConnection();

    if (dbConnected) {
        loggerWrapper.logger.info("This service is ready");
        res.status(StatusCodes.OK).json({dbConnected})
        return
    }


    loggerWrapper.logger.info("This service is not ready");
    res.status(501).json({ dbConnected })

}
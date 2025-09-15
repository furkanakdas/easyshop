import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { checkDbConnection, prisma } from "../clients/database.client";
import {  loggerWrapper } from "@faeasyshop/common";





export async function readyController(req: Request, res: Response) {

    const dbConnected = await checkDbConnection();

    if (dbConnected) {
        loggerWrapper.logger.info("This service is ready");
        res.status(StatusCodes.OK).json({dbConnected})
        return
    }


    loggerWrapper.logger.info("This service is not ready");
    res.status(501).json({ dbConnected })

}
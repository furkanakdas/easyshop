import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import {  loggerWrapper } from "@faeasyshop/common";
import { elasticConnected } from "../../elasticsearch/check-elastic-health";





export async function readyController(req: Request, res: Response) {


    if (elasticConnected) {
        loggerWrapper.logger.info("This service is ready");
        res.status(StatusCodes.OK).json({elasticConnected})
        return
    }


    loggerWrapper.logger.info("This service is not ready");
    res.status(501).json({ elasticConnected })

}
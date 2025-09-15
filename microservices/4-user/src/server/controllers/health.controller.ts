import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../clients/database.client";

export async function healthController(req: Request, res: Response) {



    res.status(StatusCodes.OK).json({ status: 'ok' })
}




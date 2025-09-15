import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { Prisma } from "@prisma/client";
import { BadRequestError } from "@faeasyshop/common";

export async function getBuyerProfileController(req: Request<{}, {}, {}>, res: Response) {


    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentUser = req.gatewayJwtPayload.clientJwtPayload;



    const buyerProfile = await prisma.buyerProfile.findUnique({ where: { userId: currentUser.id }});


    res.status(StatusCodes.OK).json({ buyerProfile });
}
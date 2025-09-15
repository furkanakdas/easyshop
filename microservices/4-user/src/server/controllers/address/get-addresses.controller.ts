import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { Prisma } from "@prisma/client";
import { BadRequestError } from "@faeasyshop/common";
import { GetAddressParams } from "../../schemas/get-address.schema";

export async function getAddressesController(req: Request<{}, {},{} , {}>, res: Response) {


    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentuser = req.gatewayJwtPayload.clientJwtPayload;



    const buyerProfile = await prisma.buyerProfile.findUnique({ where: { userId: currentuser.id } });

    if(!buyerProfile){
        throw new BadRequestError({ message: "BuyerProfile of this addresses doen not exist" })
    }


    const addresses = await prisma.address.findMany({ where: { buyerProfileId:buyerProfile.userId }});


    res.status(StatusCodes.OK).json({ addresses });
}
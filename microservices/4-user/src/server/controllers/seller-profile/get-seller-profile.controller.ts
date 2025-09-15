import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { Prisma,  } from "@prisma/client";
import { BadRequestError, ForbiddenError } from "@faeasyshop/common";

export async function getSellerProfileController(req: Request, res: Response) {


    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentUser = req.gatewayJwtPayload.clientJwtPayload;



  


    const sellerProfile = await prisma.sellerProfile.findUnique({where:{userId:currentUser.id}})

    
    if (!sellerProfile) {
        throw new BadRequestError({ message: "Seller profile does not exist" })
    }


    res.status(StatusCodes.OK).json({ sellerProfile });
}
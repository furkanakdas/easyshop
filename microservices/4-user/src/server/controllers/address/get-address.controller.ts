import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { Prisma } from "@prisma/client";
import { BadRequestError } from "@faeasyshop/common";
import { GetAddressParams } from "../../schemas/get-address.schema";

export async function getAddressController(req: Request<GetAddressParams, {},{} , {}>, res: Response) {

    const addressId = req.params.id;

    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentUser = req.gatewayJwtPayload.clientJwtPayload;



    const address = await prisma.address.findUnique({
         where: { id: addressId , buyerProfileId:currentUser.id}
        });


    res.status(StatusCodes.OK).json({ address });
}
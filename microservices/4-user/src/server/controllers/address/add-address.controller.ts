import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { CreateAddressBody } from "../../schemas/create-address.schema";
import { Prisma } from "@prisma/client";
import { BadRequestError, producerWrapper, Topics } from "@faeasyshop/common";
import { createBuyerProfileEventValue } from "../../event-value-creaters/buyer-profile.event-creater";
import { BuyerProfileUpdatedProducer } from "../../../kafka/producers/buyer-profile-updated.producer";

export async function createAddressController(req: Request<{}, {}, CreateAddressBody>, res: Response) {

    const body: CreateAddressBody = req.body;



    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }


    const currentUser = req.gatewayJwtPayload.clientJwtPayload;




    const buyerProfile = await prisma.buyerProfile.findUnique({ where: { userId: currentUser.id } });

    if (!buyerProfile) {
        throw new BadRequestError({ message: "This user's profile does not exist" });
    }

    const addressCreateInput = { ...body, buyerProfile: { connect: { userId: buyerProfile.userId } } } satisfies Prisma.AddressCreateInput;

    const createdAddress = await prisma.$transaction(async tx => {


        const createdAddress = await tx.address.create({ data: addressCreateInput });

        const eventValue = await createBuyerProfileEventValue(tx,buyerProfile.userId);

        const buyerProfileUpdatedEventOutbox = await tx.outboxEvent.create({
            data: {
                aggregateId: buyerProfile.userId,
                topic: Topics.BUYER_PROFILE_UPDATED,
                value: eventValue,
            }
        })

        return createdAddress;
    })




    res.status(StatusCodes.OK).json({ address: createdAddress });
}



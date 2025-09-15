import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { Prisma } from "@prisma/client";
import { BadRequestError, loggerWrapper, producerWrapper, Topics } from "@faeasyshop/common";
import { createBuyerProfileEventValue } from "../../event-value-creaters/buyer-profile.event-creater";
import { BuyerProfileUpdatedProducer } from "../../../kafka/producers/buyer-profile-updated.producer";

export async function updateBuyerProfileController(req: Request<{}, {}, UpdateBuyerProfileBody>, res: Response) {

    const body = req.body;

    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentUser = req.gatewayJwtPayload.clientJwtPayload;


    const updateBuyerProfileInput = { ...body } satisfies Prisma.BuyerProfileUpdateInput;

    const updatedBuyerProfile = await prisma.$transaction(async tx => {

        const updatedBuyerProfile = await tx.buyerProfile.update({ where: { userId: currentUser.id }, data: updateBuyerProfileInput });

        loggerWrapper.info("buyer profile updated", { updateBuyerProfileInput });

        const eventValue = await createBuyerProfileEventValue(tx,updatedBuyerProfile.userId);

        const buyerProfileUpdatedEventOutbox = await tx.outboxEvent.create({
            data: {
                aggregateId: updatedBuyerProfile.userId,
                topic: Topics.BUYER_PROFILE_UPDATED,
                value: eventValue,
            }
        })

        return updatedBuyerProfile
    })






    res.status(StatusCodes.OK).json({ userId: currentUser.id, buyerProfile: updatedBuyerProfile });
}
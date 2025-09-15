import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { CreateAddressBody } from "../../schemas/create-address.schema";
import { Prisma } from "@prisma/client";
import { BadRequestError, producerWrapper, Topics } from "@faeasyshop/common";
import { UpdateAddressBody, UpdateAddressParams, UpdateAddressQuery } from "../../schemas/update-address.schema";
import { createBuyerProfileEventValue } from "../../event-value-creaters/buyer-profile.event-creater";
import { BuyerProfileUpdatedProducer } from "../../../kafka/producers/buyer-profile-updated.producer";

export async function updateAddressController(req: Request<UpdateAddressParams, {}, UpdateAddressBody, UpdateAddressQuery>,
    res: Response) {

    const body = req.body;
    const addressId = req.params.id;

    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentUser = req.gatewayJwtPayload.clientJwtPayload;

    const addressUpdateInput = { ...body } satisfies Prisma.AddressUpdateInput;

    const updatedAddress = await prisma.$transaction(async tx => {

        const updatedAddress = await tx.address.update({
            where: { id: addressId, buyerProfileId: currentUser.id },
            data: addressUpdateInput,
            include: { buyerProfile: true }
        });


        const eventValue = await createBuyerProfileEventValue(tx,updatedAddress.buyerProfile.userId);

        const buyerProfileUpdatedEventOutbox = await tx.outboxEvent.create({
            data: {
                aggregateId: updatedAddress.buyerProfile.userId,
                topic: Topics.BUYER_PROFILE_UPDATED,
                value: eventValue,
            }
        })

        return updatedAddress
    })





    res.status(StatusCodes.OK).json({ address: updatedAddress });
}



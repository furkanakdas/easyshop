import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../clients/database.client";
import { BadRequestError, ClientJwtPayload, createJwtRS256, producerWrapper, Topics, UserRole } from "@faeasyshop/common";

import { verifyOptSchema } from "../schemas/verify-opt.schema";
import { UserUpdatedProducer } from "../../kafka/producers/user-updated.producer";
import { safeUserSchema } from "../schemas/safe-user.schema";
import { config } from "../../config";
import { createHash } from "../helpers/hash";
import { createUserUpdatedEventValue } from "../event-value-creaters/create-user-updated-event-value";
import { getDeviceId } from "../helpers/get-device-id";

export async function verifyOptController(req: Request, res: Response) {

    const request = verifyOptSchema.parse(req);

    const { otp } = request.query;

    const user = await prisma.user.findFirst({
        where: {
            otp: otp,
            otpExpiresAt: { gt: new Date() }
        }
    });


    if (!user) {
        throw new BadRequestError({ message: "otp is invalid" })
    }

    const updatedUser = await prisma.$transaction(async tx => {

        const updatedUser = await tx.user.update({
            where: { id: user.id },
            data: {
                otp: null,
                otpExpiresAt: null,
                lastLoginAt: new Date()
            }
        })



        const deviceId = getDeviceId(req);

        await tx.trustedDevice.create({ data: { deviceId, userId: updatedUser.id } });


        const userUpdatedEventValue = await createUserUpdatedEventValue(updatedUser);

        const userUpdatedEventOutbox = await tx.outboxEvent.create({
            data: {
                aggregateId: updatedUser.id,
                topic: Topics.USER_UPDATED,
                value: userUpdatedEventValue,
            }
        })

        return updatedUser;
    })





    const clientJwt = createJwtRS256<ClientJwtPayload>(
        {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
        }
        , config.JWT_CLIENT_PRIVATE_TOKEN,
        {})

    req.session = { jwt: clientJwt };

    const safeUser = safeUserSchema.parse(updatedUser);


    res.status(StatusCodes.OK).json({ user: safeUser });

}
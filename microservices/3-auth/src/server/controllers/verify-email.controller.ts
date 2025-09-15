import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../clients/database.client";
import { BadRequestError, ClientJwtPayload, createJwtRS256, loggerWrapper, producerWrapper, Topics, UserRole } from "@faeasyshop/common";
import { config } from "../../config";
import { UserUpdatedProducer } from "../../kafka/producers/user-updated.producer";
import { safeUserSchema } from "../schemas/safe-user.schema";
import { createUserUpdatedEventValue } from "../event-value-creaters/create-user-updated-event-value";

//verify-email?token=dasdasdasd
export async function verifyEmailController(req: Request, res: Response) {

    const emailVerToken = req.query.token as string;



    const user = await prisma.user.findFirst({

        where: {
            emailVerificationToken: emailVerToken,
            emailVerificationExpiresAt: { gt: new Date() }
        }
    });




    if (!user) {
        throw new BadRequestError({ message: "this token is invalid" });
    }

    //not likely
    if (user.isEmailVerified) {
        throw new BadRequestError({ message: "this user's email already verified" });
    }


    const updatedUser = await prisma.$transaction(async tx => {
        const updatedUser = await tx.user.update({
            where: {
                email: user.email,
            },
            data: {
                isEmailVerified: true,
                emailVerificationToken: null,
                emailVerificationExpiresAt: null,
                lastLoginAt: new Date(),
            },
        });

        loggerWrapper.info("email verified", { userId: user.id });


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
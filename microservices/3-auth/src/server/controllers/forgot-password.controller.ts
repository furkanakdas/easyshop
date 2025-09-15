import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';

import { ForgotPasswordBody } from "../schemas/forgot-pasword.schema";
import { prisma } from "../clients/database.client";
import { BadRequestError, kafkaClientWrapper, producerWrapper, Topics } from "@faeasyshop/common";
import { createToken } from "../helpers/create-token";
import { ForgotPasswordProducer } from "../../kafka/producers/forgot-password.producer";
import { config } from "../../config";

const PASSWORD_TOKEN_EXPIRATION_TIME = 15 * 60 * 1000; //15dk


export async function forgotPasswordController(req: Request<{}, {}, ForgotPasswordBody>, res: Response) {

    const input = { ...req.body };

    const existingUser = await prisma.user.findFirst({
        where: {
            email: input.email,
        },
    });

    if (!existingUser) {
        throw new BadRequestError({ message: "User does not exist" })
    }

    const resetPasswordToken = createToken();
    const now = new Date()
    const resetPasswordExpiresAt = new Date(now.getTime() + PASSWORD_TOKEN_EXPIRATION_TIME);


    await prisma.$transaction(async tx => {
        const updatedUser = await tx.user.update({
            where: { email: existingUser.email },
            data: { resetPasswordToken, resetPasswordExpiresAt }
        });

        const receiverEmail = updatedUser.email;
        const resetLink = `${config.CLIENT_URL}/reset-password?token=${updatedUser.resetPasswordToken}`;



        const forgotPasswordEventOutbox = await tx.outboxEvent.create({
            data: {
                aggregateId: updatedUser.id,
                topic: Topics.FORGOT_PASSWORD,
                value: { receiverEmail, resetLink },
            }
        })
    })



    res.status(StatusCodes.OK).json({})



}
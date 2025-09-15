import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../clients/database.client";
import { BadRequestError, ClientJwtPayload, createJwtRS256, kafkaClientWrapper, loggerWrapper, producerWrapper, RequestValidationError, Topics, UserRole } from "@faeasyshop/common";
import { comparePasswords, hashPassword } from "../helpers/bcryptjs.password";
import { config } from "../../config";
import { signinSchema } from "../schemas/signin.schema";
import { createToken } from "../helpers/create-token";
import { VerifyEmailProducer } from "../../kafka/producers/verify-email.producer";
import { UserUpdatedProducer } from "../../kafka/producers/user-updated.producer";
import { safeUserSchema } from "../schemas/safe-user.schema";
import { VerifyOtpProducer } from "../../kafka/producers/verify-otp.producer";
import { createHash } from "../helpers/hash";
import { createUserUpdatedEventValue } from "../event-value-creaters/create-user-updated-event-value";
import { generateOtp } from "../helpers/generate-otp";
import { getDeviceId } from "../helpers/get-device-id";
import { $Enums } from "@prisma/client";

const EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME = 15 * 60 * 1000; //15dk
const OPT_EXPIRATION_TIME = 5 * 60 * 1000; // 5 dk


export async function signinController(req: Request, res: Response) {

    const request = signinSchema.parse(req);
    const input = request.body;


    const existingUser = await prisma.user.findUnique({
        where: {
            email: input.email,
        },
    });

    if (!existingUser) {
        throw new BadRequestError({ message: "User does not exist" })
    }


    const passwordVerified = await comparePasswords(input.password, existingUser.passwordHash)

    if (!passwordVerified) {
        throw new BadRequestError({ message: "Password does not match" })
    }


    if (existingUser.role == $Enums.UserRole.ADMIN || existingUser.role == $Enums.UserRole.SYSTEM) {

        let clientJwt: string | undefined;

        clientJwt = createJwtRS256<ClientJwtPayload>(
            {
                id: existingUser.id,
                email: existingUser.email,
                role: existingUser.role
            }
            , config.JWT_CLIENT_PRIVATE_TOKEN,
            {})


        req.session = { jwt: clientJwt };

        const safeUser = safeUserSchema.parse(existingUser);



        res.status(StatusCodes.OK).json({ user: safeUser });
        return
    }



    const updatedUser = await prisma.$transaction(async tx => {

        if (!existingUser.isEmailVerified) {


            const emailVerificationToken = createToken();
            const now = new Date()
            const emailVerificationExpiresAt = new Date(now.getTime() + EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME);

            const updatedUser = await tx.user.update({
                where: { email: existingUser.email },
                data: { emailVerificationToken, emailVerificationExpiresAt }
            });

            loggerWrapper.info("user updated", updatedUser)



            //send verify email

            const receiverEmail = updatedUser.email;
            const verifyLink = `${config.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;

            const verifyEmailEventOutbox = await tx.outboxEvent.create({
                data: {
                    aggregateId: updatedUser.id,
                    topic: Topics.VERIFY_EMAIL,
                    value: { receiverEmail, verifyLink },
                }
            })

            loggerWrapper.info("verifyEmailEventOutbox created", verifyEmailEventOutbox)

            return
        }






        const deviceId = getDeviceId(req);
        const trustedDevice = await tx.trustedDevice.findFirst({ where: { userId: existingUser.id, deviceId } })

        if (!trustedDevice) {
            const otp = generateOtp();

            const now = new Date()
            const otpExpiresAt = new Date(now.getTime() + OPT_EXPIRATION_TIME);

            await tx.user.update({
                where: { id: existingUser.id },
                data: { otp, otpExpiresAt }
            })

            const receiverEmail = existingUser.email;
            const verifyLink = `${config.CLIENT_URL}/verify-otp?otp=${otp}`;


            const verifyOtpEventOutbox = await tx.outboxEvent.create({
                data: {
                    aggregateId: existingUser.id,
                    topic: Topics.VERIFY_OTP,
                    value: { receiverEmail, verifyLink },
                }
            })

            throw new BadRequestError({ message: "OTP needed" })
        }



        const updatedUser = await tx.user.update({ where: { email: existingUser.email }, data: { lastLoginAt: new Date() } });
        loggerWrapper.info("user signed-in", { userId: updatedUser.id });


        const userUpdatedEventValue = await createUserUpdatedEventValue(updatedUser);

        const userUpdatedEventOutbox = await tx.outboxEvent.create({
            data: {
                aggregateId: updatedUser.id,
                topic: Topics.USER_UPDATED,
                value: userUpdatedEventValue,
            }
        })

        return updatedUser
    })


    if (!updatedUser) {
        throw new BadRequestError({ message: "email is not yet verified. Email-verify email send" })
    }


    let clientJwt: string | undefined;

    clientJwt = createJwtRS256<ClientJwtPayload>(
        {
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role
        }
        , config.JWT_CLIENT_PRIVATE_TOKEN,
        {})


    req.session = { jwt: clientJwt };

    const safeUser = safeUserSchema.parse(updatedUser);


    res.status(StatusCodes.OK).json({ user: safeUser })



}
import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { SignupBody, signupSchema } from "../schemas/signup.schema";
import { prisma } from "../clients/database.client";
import { BadRequestError, loggerWrapper, Topics, VerifyEmailEvent } from "@faeasyshop/common";
import { hashPassword } from "../helpers/bcryptjs.password";
import { Prisma } from "@prisma/client";
import { config } from "../../config";
import { createToken } from "../helpers/create-token";
import { safeUserSchema } from "../schemas/safe-user.schema";
import { createUserCreatedEventValue } from "../event-value-creaters/create-user-created-event-value";
import { getDeviceId } from "../helpers/get-device-id";
import { VerifyEmailProducer } from "../../kafka/producers/verify-email.producer";


const EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME = 15 * 60 * 1000; //15dk


export async function signupController(req: Request<{}, {}, SignupBody>, res: Response) {

    const input = { ...req.body };
    console.log(input);

    const existingUser = await prisma.user.findUnique({
        where: {
            email: input.email,
        },
    });


    if (existingUser) {
        throw new BadRequestError({ message: "User already exist" })
    }



    //create user
    const emailVerToken = createToken();
    const now = new Date()
    const emailVerificationExpiresAt = new Date(now.getTime() + EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME);

    const hashedPassword = await hashPassword(input.password);

    const userCreateInput: Prisma.UserCreateInput = {
        email: input.email,
        passwordHash: hashedPassword,
        emailVerificationToken: emailVerToken,
        emailVerificationExpiresAt,
    };

    const createdUser = await prisma.user.create({ data: userCreateInput });


    const receiverEmail = createdUser.email;
    const verifyLink = `${config.CLIENT_URL}/verify-email?token=${createdUser.emailVerificationToken}`;

    const verifyEmailProducer = new VerifyEmailProducer();
    await verifyEmailProducer.send({ receiverEmail, verifyLink });


    const verifyEmailEventOutbox = await prisma.outboxEvent.create({
        data: {
            aggregateId: createdUser.id,
            topic: Topics.VERIFY_EMAIL,
            value: { receiverEmail, verifyLink },
            processed:true
        }
    })

    loggerWrapper.info("verifyEmail eventOutbox created", { verifyEmailEventOutbox, from: "signupController" });


    //add device
    const deviceId = getDeviceId(req);
    const trustedDevice = await prisma.trustedDevice.create({ data: { deviceId, userId: createdUser.id } });
    loggerWrapper.info("trusted device added", { trustedDevice, from: "signupController" });


    const userCreatedEventValue = await createUserCreatedEventValue(createdUser)
    const userCreatedEventOutbox = await prisma.outboxEvent.create({
        data: {
            aggregateId: createdUser.id,
            topic: Topics.USER_CREATED,
            value: userCreatedEventValue,
        }
    })

    loggerWrapper.info("userCreated eventOutbox created", { userCreatedEventOutbox, from: "signupController" });





    const safeUser = safeUserSchema.parse(createdUser);

    res.status(StatusCodes.OK).json({ user: safeUser })

}
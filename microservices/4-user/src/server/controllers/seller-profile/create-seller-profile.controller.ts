import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { CreateAddressBody } from "../../schemas/create-address.schema";
import { $Enums, Prisma, } from "@prisma/client";
import { BadRequestError, ClientJwtPayload, CompanyType, loggerWrapper, producerWrapper, SellerProfileStatus, Topics, } from "@faeasyshop/common";
import { CreateSellerBody } from "../../schemas/create-seller-profile.schema";
import { stripe } from "../../clients/stripe.client";
import { config } from "../../../config";
import crypto from 'crypto'
import { SellerProfileCreatedProducer } from "../../../kafka/producers/seller-profile-created.producer";
import { createSellerProfileEventValue } from "../../event-value-creaters/seller-profile.event-creater";

export async function createSellerProfileController(req: Request<{}, {}, CreateSellerBody>, res: Response) {




    const sellerProfileBody = req.body;



    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentUser = req.gatewayJwtPayload.clientJwtPayload





    const sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: currentUser.id } });


    loggerWrapper.info(config.STRIPE_TEST_SECRET_KEY)
    if (sellerProfile) {
        throw new BadRequestError({ message: "Seller profile already created" });
    }

    // Simülasyon: Stripe Express account oluştur
    const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: sellerProfileBody.email,
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
        business_type: 'individual',
    });



    // Onboarding link oluştur
    const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'http://localhost:4001/api/user/seller-profile/reauth',
        return_url: 'http://localhost:4001/api/user/seller-profile/dashboard',
        type: 'account_onboarding',
    });


    const createdSellerProfile = await prisma.$transaction(async tx => {

        const sellerProfileCreateInput = { ...sellerProfileBody, user: { connect: { id: currentUser.id } }, stripeAccountId: account.id } satisfies Prisma.SellerProfileCreateInput

        const createdSellerProfile = await tx.sellerProfile.create({ data: { ...sellerProfileCreateInput } });


        const eventValue = await createSellerProfileEventValue(tx,createdSellerProfile.userId);

        const sellerProfileCreatedEventOutbox = await tx.outboxEvent.create({
            data: {
                aggregateId: createdSellerProfile.userId,
                topic: Topics.SELLER_PROFILE_CREATED,
                value: eventValue,
            }
        })

        return createdSellerProfile
    })






    res.status(StatusCodes.OK).json({ sellerProfile: { ...createdSellerProfile }, onboardingLink: accountLink.url });
}



import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";

import { $Enums, Prisma, } from "@prisma/client";
import { BadRequestError, ClientJwtPayload,  ForbiddenError, UserRole } from "@faeasyshop/common";
import { CreateSellerBody } from "../../schemas/create-seller-profile.schema";
import { checkSellerProfileApproved } from "../../helpers/check-seller-profile-approved.stripe";
import { stripe } from "../../clients/stripe.client";


export async function sellerProfileReauthController(req: Request<{}, {}, CreateSellerBody>, res: Response) {


    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentuser = req.gatewayJwtPayload.clientJwtPayload




    const sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: currentuser.id } });

    if (!sellerProfile) {
        throw new BadRequestError({ message: "Seller profile for this user does not exist" });
    }

    if (sellerProfile.status != $Enums.SellerProfileStatus.PENDING) {
        throw new BadRequestError({ message: "Your sellerProfile status is not pending" });
    }



    const approved = await checkSellerProfileApproved(sellerProfile);


    if (approved) {
        res.status(StatusCodes.OK).json({ message: "Stripe hesabiniz zaten başariyla bağlanmiş!" });
        return;
    }

    console.log(sellerProfile.stripeAccountId);

    const accountLink = await stripe.accountLinks.create({
        account: sellerProfile.stripeAccountId,
        refresh_url: 'http://localhost:4001/api/user/seller-profile/reauth',
        return_url: 'http://localhost:4001/api/user/seller-profile/dashboard',
        type: 'account_onboarding',
    });

    res.status(StatusCodes.OK).json({ onboardingLink: accountLink.url });

}



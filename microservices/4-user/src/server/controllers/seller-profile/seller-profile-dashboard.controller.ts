import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { prisma } from "../../clients/database.client";
import { UpdateBuyerProfileBody } from "../../schemas/update-buyer-profile.schema";
import { CreateAddressBody } from "../../schemas/create-address.schema";
import { $Enums, Prisma, SellerProfileStatus,  } from "@prisma/client";
import { BadRequestError, ClientJwtPayload, ForbiddenError,UserRole } from "@faeasyshop/common";
import { CreateSellerBody } from "../../schemas/create-seller-profile.schema";
import { stripe } from "../../clients/stripe.client";
import { config } from "../../../config";
import crypto from 'crypto'
import { checkSellerProfileApproved } from "../../helpers/check-seller-profile-approved.stripe";

export async function sellerProfileDashboardController(req: Request<{}, {}, CreateSellerBody>, res: Response) {


    if (!req.gatewayJwtPayload || !req.gatewayJwtPayload.clientJwtPayload) {
        throw new Error("This route should be protected")
    }

    const currentUser = req.gatewayJwtPayload.clientJwtPayload





    const sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: currentUser.id } });

    if (!sellerProfile) {
        throw new BadRequestError({ message: "Seller profile for this user does not exist" });
    }

    if (sellerProfile.status != $Enums.SellerProfileStatus.PENDING) {
        throw new BadRequestError({ message: "Your sellerProfile status is not pending" });
    }


    const approved = await checkSellerProfileApproved(sellerProfile);

    if(approved){
        res.status(StatusCodes.OK).json({ message: "Stripe hesabiniz başariyla bağlandi!" });
        return 
    }

    res.status(StatusCodes.OK).json({message:`Stripe hesabiniz inceleniyor. Lütfen daha sonra tekrar kontrol edin`});


}



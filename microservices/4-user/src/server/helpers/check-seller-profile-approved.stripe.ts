import { Prisma, SellerProfile, SellerProfileStatus } from "@prisma/client";
import { stripe } from "../clients/stripe.client";
import { StatusCodes } from "http-status-codes";






export async function checkSellerProfileApproved(sellerProfile: SellerProfile) {

    if (sellerProfile.status == SellerProfileStatus.APPROVED) {
        return true;

    } else {

        const stripeAccount = await stripe.accounts.retrieve(sellerProfile.stripeAccountId);

        if (stripeAccount.charges_enabled && stripeAccount.details_submitted) {
            return true
        }

        return false;
        
    }

}
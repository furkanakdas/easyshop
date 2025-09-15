


import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { cartRepository, orderRepository, productRepository } from "../../../orm/repositories";
import { BadRequestError, Currency, GenericError, loggerWrapper, OrderStatus } from "@faeasyshop/common";
import { stripe } from "../../../clients/stripe.client";
import { getPaymentIntentRequestSchema } from "../../schema/order.schema";





export interface SellerGroup {

    sellerStripeAccountId: string;
    orderProducts: {
        stripeProductId: string,
        stripePriceId: string,
        quantity: number,
        price: number;
    }[]
    currency: Currency
    amount: number

}



export async function getPaymentIntentController(req: Request, res: Response) {

    const request = getPaymentIntentRequestSchema.parse(req);
    const paymentIntentId = request.params.paymentIntentId;

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    try {
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
        res.status(StatusCodes.OK).json({  paymentIntentStatus: intent.status })
    } catch (error) {
        if(error instanceof Error)
        throw new GenericError({ message: error.message, httpStatus: StatusCodes.INTERNAL_SERVER_ERROR })
    }

}




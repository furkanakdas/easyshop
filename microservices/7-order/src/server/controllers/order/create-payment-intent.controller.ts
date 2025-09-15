import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { cartRepository, orderRepository, productRepository } from "../../../orm/repositories";
import { BadRequestError, Currency, GenericError, loggerWrapper, OrderStatus } from "@faeasyshop/common";
import { SystemConflictError } from "../../errors/system-conflict.error";
import { stripe } from "../../../clients/stripe.client";
import { createSellerGroups } from "../../services/order.service";
import { createPaymentIntentRequestSchema } from "../../schema/order.schema";





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



export async function createPaymentIntentController(req: Request, res: Response) {

    const request = createPaymentIntentRequestSchema.parse(req);
    const orderId = request.body.orderId;

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }


    const cart = await cartRepository.findOne({ where: { buyerId: currentUser.id } });

    if (!cart) {
        throw new Error("Cart should have created")
    }


    
    const order = await orderRepository.findOne({
        where: { id: orderId, buyerId: currentUser.id },
        relations: ["orderProducts", "orderProducts.product", "orderProducts.product.seller"]
    });


    if (!order) {
        throw new BadRequestError({ message: "your order content has changed or removed" })
    }

    if (order.orderProducts.length == 0) {
        throw new BadRequestError({ message: "cart is empty" })
    }

    if (order.status != OrderStatus.CREATED && order.status != OrderStatus.AWAITING_PAYMENT) {
        throw new BadRequestError({ message: "to create paymentIntent orderStatus must be created or awaiting payment" })
    }

    if (order.paymentIntentId) {
        
        loggerWrapper.info("this order already has a payment intent",{paymentIntent:order.paymentIntentId})

        try {

            const intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

            // Süresi geçmiş olabilir veya manuel iptal edilmiştir
            if (intent.status != "canceled" ) {
                loggerWrapper.info("payment intent status is not 'cancelled'  so returning the old payment intent")
                res.status(StatusCodes.OK).json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
                return;
            }else{
                loggerWrapper.info("payment intent status is  'cancelled' so creating a new one")
            }

        } catch (error) {
            if (error instanceof Error)
                throw new GenericError({ message: error.message, httpStatus: StatusCodes.INTERNAL_SERVER_ERROR })
        }


    }


    const grouped = createSellerGroups(order.orderProducts)

    const totalAmount = grouped.reduce((sum, group) => sum + group.amount, 0);

    loggerWrapper.info("grouped sellers created",{grouped,totalAmount})

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: "usd",
            capture_method: 'manual', // sadece otorizasyon yapılacak
            metadata: {
                sellers: JSON.stringify(grouped)
            },
            // automatic_payment_methods: {
            //     enabled: true,
            // },

            payment_method_types: ['card'],
        });

        loggerWrapper.info("payment intent created",{paymentIntent})

        order.status = OrderStatus.AWAITING_PAYMENT;
        order.paymentIntentId = paymentIntent.id
        await orderRepository.save(order);
        loggerWrapper.info("order status and payment intent updated",{status:order.status,paymentIntentId:order.paymentIntentId})

        res.status(StatusCodes.OK).json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id })

    } catch (error: any) {
        if (error instanceof Error) {
            throw new GenericError({ message: error.message, httpStatus: StatusCodes.INTERNAL_SERVER_ERROR })
        }
    }







}




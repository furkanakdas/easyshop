import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { cartRepository, orderRepository, productRepository } from "../../../orm/repositories";
import { stripe } from "../../../clients/stripe.client";
import { SellerGroup } from "./create-payment-intent.controller";
import { In } from "typeorm";
import { runInTransaction } from "../../helpers/runInTransaction";
import { Product } from "../../../orm/entity/product";
import { OutboxStripeTransfers } from "../../../orm/entity/outbox-stripe-transfers";
import { BadRequestError, GenericError, loggerWrapper, OrderStatus, Topics } from "@faeasyshop/common";
import { OrderCreatedProducer } from "../../../kafka/producers/order-created.producer";
import { createOrderCreatedEventValue } from "../../event-value-creaters/order-created-event-value-creater";
import { compareProductsWithOrderProducts, reduceQuantityAndReservation, reservateProduct } from "../../services/order.service";
import { payRequestSchema } from "../../schema/order.schema";
import { OutboxEvent } from "../../../orm/entity/outbox-event";
import { Cart } from "../../../orm/entity/cart";

export async function payController(req: Request, res: Response) {

    const request = payRequestSchema.parse(req);
    const paymentIntentId = request.body.paymentIntentId;
    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    const cart = await cartRepository.findOne({ where: { buyerId: currentUser.id } });

    if (!cart) {
        throw new Error("this buyer should have had cart");
    }



    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    loggerWrapper.info("payment intent retreived from stipe", { paymentIntentId: paymentIntent.id })

    const sellersGroup = JSON.parse(paymentIntent.metadata.sellers) as SellerGroup[];
    loggerWrapper.info("sellers group extracted", { sellersGroup })


    const order = await orderRepository.findOne({ where: { paymentIntentId, buyerId: currentUser.id } });

    if (!order) {
        throw new BadRequestError({ message: "You cant pay because order does not exist" })
    }

    if (order.status != OrderStatus.AWAITING_PAYMENT) {
        throw new BadRequestError({ message: "order status is not AWAITING_PAYMENT" })
    }

    if (paymentIntent.status != "requires_capture") {
        throw new BadRequestError({ message: "paymentIntent  status should be 'requires_capture' " })
    }




    //kritik bölge
    await runInTransaction(async (manager) => {


        let orderProductStripeIds: string[] = [];
        let orderProducts: SellerGroup["orderProducts"] = [];


        for (const seller of sellersGroup) {

            const currProductIds = seller.orderProducts.map(item => {
                return item.stripeProductId
            });

            orderProducts.push(...seller.orderProducts);
            orderProductStripeIds.push(...currProductIds);
        }


        const products = await manager.find(Product, { where: { stripeProductId: In(orderProductStripeIds) }, relations: ["reservation"] });

        loggerWrapper.info("products :", products)

        compareProductsWithOrderProducts(products, orderProducts);
        loggerWrapper.info("products and orderProducts compared");
        await reservateProduct(products, orderProducts, manager);
        loggerWrapper.info("products reservated");


        try {

            await stripe.paymentIntents.capture(paymentIntentId);
            loggerWrapper.info("payment intent captured")

            try {

                await reduceQuantityAndReservation(products, orderProducts, manager);

                order.status = OrderStatus.COMPLETED;
                await manager.save(order);
                loggerWrapper.info("order status set to completed")


                const cart = await manager.findOne(Cart,{where:{orderId:order.id}});
                
                if(!cart){
                    throw new Error("order is not related to any cart");
                }

                cart.order = null;
                cart.cartProducts = [];
                await manager.save(cart);


                const createdStripeTransfersOutbox = manager.create(OutboxStripeTransfers, {
                    paymentIntentId: paymentIntentId,
                    sellerGroups: sellersGroup
                })
                const stripeTransfersOutbox = await manager.save(createdStripeTransfersOutbox)
                loggerWrapper.info("StripeTransfersOutbox created", { stripeTransfersOutbox })


                const orderCreatedEventValue = await createOrderCreatedEventValue(order.id)
                const orderCreatedEventOutbox = manager.create(OutboxEvent, {
                    aggregateId: order.id,
                    topic: Topics.ORDER_CREATED,
                    value: orderCreatedEventValue,
                });

                

                await manager.save(orderCreatedEventOutbox);

                


            } catch (error) {

                if (error instanceof Error) {
                    const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });
                    throw new GenericError({ message: error.message, httpStatus: StatusCodes.INTERNAL_SERVER_ERROR })
                }

            }


        } catch (error: any) {

            const captureErr = error as { type: string, code: string, message: string, decline_code: string }

            if (captureErr.type === 'StripeCardError') {
                throw new BadRequestError({ message: captureErr.message })
            } else {
                throw new GenericError({ message: captureErr.message, httpStatus: StatusCodes.INTERNAL_SERVER_ERROR })
            }
        }



    });


    res.status(StatusCodes.OK).json({})
}



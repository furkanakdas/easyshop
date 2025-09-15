



import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { rateOrderProductRequestSchema } from "../schema/rate-order-product.schema";
import { orderProductRepository, orderRepository, reviewRepository } from "../../orm/repositories";
import { BadRequestError, OrderStatus, producerWrapper, ReviewTargetType } from "@faeasyshop/common";
import { createReviewCreatedEventValue } from "../event-value-creaters/create-review-created-event-value";
import { ReviewCreatedProducer } from "../../kafka/producers/review-created.producer";


// http://host:port/api/review/rate/order/:id/order-product/:id
export async function rateOrderProductController(req: Request, res: Response) {

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    const request = rateOrderProductRequestSchema.parse(req);
    const params = request.params;
    const reviewInput = request.body;





    const order = await orderRepository.findOne({
        where: {
            buyerId: currentUser.id,
            id: params.orderId
        }
    })

    if (!order) {
        throw new BadRequestError({ message: "No order found for this user" });
    }

    if (order.status != OrderStatus.COMPLETED) {
        throw new BadRequestError({ message: "To rate order, order should be completed" });
    }

    const orderProduct = await orderProductRepository.findOne({
        where: {
            orderId: order.id,
            id: params.orderProductId
        }
    })

    if (!orderProduct) {
        throw new BadRequestError({ message: "No orderProduct found related to this order" });
    }

    const review = await reviewRepository.findOne({
        where: {
            targetId: orderProduct.id,
            buyerId: currentUser.id
        }
    });

    if (review) {
        throw new BadRequestError({ message: "one product can be rated once for one order" });
    }

    const createdReview = reviewRepository.create({
        buyerId: currentUser.id,
        targetId: orderProduct.productId,
        targetSnapshotId: orderProduct.id,
        targetType: ReviewTargetType.ORDER_PRODUCT,
        rating: reviewInput.rating,
        comment: reviewInput.comment
    })

    const savedReview = await reviewRepository.save(createdReview);


    const productCreatedSearchProducer = new ReviewCreatedProducer();
    const reviewCreatedEventValue = await createReviewCreatedEventValue(savedReview);
    await productCreatedSearchProducer.send(reviewCreatedEventValue);


    res.status(StatusCodes.OK).json({ status: 'ok' })
}
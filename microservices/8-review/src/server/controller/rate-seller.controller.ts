



import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { rateOrderProductRequestSchema } from "../schema/rate-order-product.schema";
import { orderProductRepository, orderRepository, reviewRepository } from "../../orm/repositories";
import { BadRequestError, OrderStatus, producerWrapper, ReviewTargetType } from "@faeasyshop/common";
import { createReviewCreatedEventValue } from "../event-value-creaters/create-review-created-event-value";
import { ReviewCreatedProducer } from "../../kafka/producers/review-created.producer";
import { rateSellerRequestSchema } from "../schema/rate-seller.schema";


// http://host:port/api/review/rate/seller/:id/order/:id
export async function rateOrderProductController(req: Request, res: Response) {

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    const request = rateSellerRequestSchema.parse(req);
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




    //ilgili siparişte herhangi bir orderProduct'ın sellerId'si  params.sellerId ile aynı mı kontrol et
    const sellerIdProducts = await orderProductRepository.find({where:{sellerId:params.sellerId}});
    
    if(sellerIdProducts.length == 0){
        throw new BadRequestError({message:"Order and seller does not match"})
    }

    const review = await reviewRepository.findOne({ where: { 
        targetId: params.sellerId,
        targetSnapshotId:order.id,
        buyerId:currentUser.id
        } 
    });

    if (review) {
        throw new BadRequestError({ message: "one seller can be rated once for order" });
    }

    const createdReview = reviewRepository.create({
        buyerId: currentUser.id,
        targetId: params.sellerId ,
        targetSnapshotId:order.id,
        targetType: ReviewTargetType.SELLER,
        rating: reviewInput.rating,
        comment: reviewInput.comment
    })

    const savedReview = await reviewRepository.save(createdReview);


    const reviewCreatedSearchProducer = new ReviewCreatedProducer();
    const reviewCreatedEventValue = await createReviewCreatedEventValue(savedReview);
    await reviewCreatedSearchProducer.send(reviewCreatedEventValue);


    res.status(StatusCodes.OK).json({ status: 'ok' })
}
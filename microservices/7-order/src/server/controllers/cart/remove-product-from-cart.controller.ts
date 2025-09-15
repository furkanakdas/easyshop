import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { cartProductRepository, cartRepository, orderRepository, productRepository } from "../../../orm/repositories";
import { addProductToCartRequestSchema, removeProductFromCartRequestSchema } from "../../schema/cart.schema";
import { BadRequestError, OrderStatus } from "@faeasyshop/common";
import { CartProduct } from "../../../orm/entity/cart-product";
import { removeProductFromCart } from "../../services/cart.service";
import { stripe } from "../../../clients/stripe.client";

export async function removeProductFromCartController(req: Request, res: Response) {

    const request = removeProductFromCartRequestSchema.parse(req);

    const removeProductFromCartInput = request.body;

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    const cart = await cartRepository.findOne({ where: { buyerId: currentUser.id }, relations: ["order"] });

    if (!cart) {
        throw new Error("Buyer has no cart")
    }

    //check if cart related to any order and if so remove prev order and set orderId to null
    if (cart.order) {

        if(cart.order.status == OrderStatus.COMPLETED || cart.order.status == OrderStatus.CANCELLED){
            throw new Error("when order created or cancelled relation with order and cart must be terminated")
        }

        if (cart.order.paymentIntentId) {
            await stripe.paymentIntents.cancel(cart.order.paymentIntentId);
        }

        await orderRepository.remove(cart.order)
        console.log("prev order removed");
    }


    await removeProductFromCart(cart.id, removeProductFromCartInput.cartProductId);





    res.status(StatusCodes.OK).json({ status: 'ok' })
}
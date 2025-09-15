import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { cartProductRepository, cartRepository, orderRepository, productRepository } from "../../../orm/repositories";
import { addProductToCartRequestSchema } from "../../schema/cart.schema";
import { BadRequestError } from "@faeasyshop/common";
import { SystemConflictError } from "../../errors/system-conflict.error";
import { removeProductFromCart } from "../../services/cart.service";
import { stripe } from "../../../clients/stripe.client";

export async function addProductToCartController(req: Request, res: Response) {

    const request = addProductToCartRequestSchema.parse(req);

    const input = request.body;

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }



    const product = await productRepository.findOne({ where: { id: input.productId } });

    if (!product) {
        throw new BadRequestError({ message: "Product you want to add to the cart does not exist" })
    }

    let cart = await cartRepository.findOne({ where: { buyerId: currentUser.id }, relations: ["cartProducts", "order"] })

    if (!cart) {
        throw new Error("cart should have been created")
    }


    //check if cart is related to any order.And if so remove prev order
    if (cart.order) {

        if(cart.order.paymentIntentId){
            await stripe.paymentIntents.cancel(cart.order.paymentIntentId);
        }

        await orderRepository.remove(cart.order)
        console.log("prev order removed");


    }



    const prevCartProduct = await cartProductRepository.findOne({ where: { cartId: cart.id, productId: product.id } });

    const newCartProduct = cartProductRepository.create({
        cartId: cart.id,
        productId: input.productId,
        quantity: input.quantity,
        productName: product.name,
        price: product.price,
        currency: product.currency,
        sellerId: product.sellerId,
        description: product.description
    })

    if (prevCartProduct) {

        if (prevCartProduct.price != newCartProduct.price) {


            await removeProductFromCart(cart.id, prevCartProduct.id);


            throw new SystemConflictError({ message: "The price of the product in the cart has changed.Product removed from cart" })
        }

    }


    if (prevCartProduct) {
        newCartProduct.id = prevCartProduct.id;
    }

    await cartProductRepository.save(newCartProduct);
    console.log("new cart products created");






    res.status(StatusCodes.OK).json({ status: 'ok' })
}
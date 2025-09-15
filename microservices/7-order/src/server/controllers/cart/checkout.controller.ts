import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { checkoutRequestSchema } from "../../schema/cart.schema";
import { buyerProfileRepository, cartProductRepository, cartRepository, orderProductRepository, orderRepository, productRepository } from "../../../orm/repositories";
import { BadRequestError, OrderStatus } from "@faeasyshop/common";
import { In, Or, Raw } from "typeorm";
import { Product } from "../../../orm/entity/product";
import { SystemConflictError } from "../../errors/system-conflict.error";
import { compareProductsWithCartProducts, removeProductFromCart } from "../../services/cart.service";
import { Order } from "../../../orm/entity/order";
import { OrderProduct } from "../../../orm/entity/order-product";
import { Cart } from "../../../orm/entity/cart";


export async function checkoutController(req: Request, res: Response) {

    const request = checkoutRequestSchema.parse(req);

    const checkoutInput = request.body;

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    const buyerProfile = await buyerProfileRepository.findOne({
        where: { userId: currentUser.id }
    });

    if (!buyerProfile) {
        throw new BadRequestError({ message: "No buyer profile found" })
    }


    //STEP2 check if input address really exists on buyer profile
    const matchAddress = buyerProfile.addresses.find(address => address.id == checkoutInput.addressId)
    if (!matchAddress) {
        throw new BadRequestError({ message: "this addressId does not match with any address" })
    }



    //STEP 3 = Find the respective cart
    const cart = await cartRepository.findOne({ where: { buyerId: currentUser.id }, relations: ["order"] });

    if (!cart) {
        throw new BadRequestError({ message: "cart of this buyer does not exist" });
    }


    //STEP 4 = Check if order created before.
    if (cart.order) {

        console.log("there is already order");
        await orderRepository.remove(cart.order);
        console.log("removed prev order");
    }


    //check if cartProducts are still current
    const cartProducts = await compareProductsWithCartProducts(cart);


    //Create new order 
    const newOrder = orderRepository.create({
        buyerId: currentUser.id,
        status: OrderStatus.CREATED,
        address: matchAddress
    })

    //convert cartproduct to orderproducts
    const orderProducts: OrderProduct[] = [];
    cartProducts.forEach(cartProduct => {

        orderProducts.push(orderProductRepository.create({
            productId: cartProduct.productId,
            productName: cartProduct.productName,
            price: cartProduct.price,
            quantity: cartProduct.quantity,
            currency:cartProduct.currency,
            sellerId:cartProduct.sellerId,
            description:cartProduct.description
        }))
    });


    cart.order = newOrder;
    cart.order.orderProducts = orderProducts;

    await cartRepository.save(cart);
    console.log("new order created");



    res.status(StatusCodes.OK).json({ status: 'ok' })
}
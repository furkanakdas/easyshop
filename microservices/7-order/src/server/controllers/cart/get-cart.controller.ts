import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import {  getCartRequestSchema } from "../../schema/cart.schema";
import { cartRepository } from "../../../orm/repositories";


export async function getCartController(req: Request, res: Response) {

    const request = getCartRequestSchema.parse(req);


    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    const cart = await cartRepository.findOne({ where: { buyerId: currentUser.id } });

    if (!cart) {
        throw new Error("this buyer should have had cart");
    }

    const cartWithProducts = await cartRepository.find({
        where: { id: cart.id, cartProducts: { cartId: cart.id } }, relations: ["cartProducts"]
    })

    console.log(cartWithProducts);
    


    res.status(StatusCodes.OK).json(cartWithProducts)
}
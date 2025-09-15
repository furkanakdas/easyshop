import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { getCartRequestSchema } from "../../schema/cart.schema";
import { cartRepository, orderRepository } from "../../../orm/repositories";
import { getOrdersByBuyerIdRequestSchema } from "../../schema/order.schema";
import { loggerWrapper, OrderStatus } from "@faeasyshop/common";


export async function getOrdersByBuyerIdController(req: Request, res: Response) {

    const request = getOrdersByBuyerIdRequestSchema.parse(req);

    const currentUser = req.gatewayJwtPayload?.clientJwtPayload;

    if (!currentUser) {
        throw new Error("this route should be protected");
    }

    const orders = await orderRepository.find({
        where: {
            buyerId: currentUser.id, status: OrderStatus.COMPLETED
        },
        relations: ["orderProducts"]
    });


    res.status(StatusCodes.OK).json(orders)
}
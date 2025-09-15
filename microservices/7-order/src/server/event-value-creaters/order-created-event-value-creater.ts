import { BadRequestError, BuyerProfileCreatedEvent, OrderCreatedEvent } from "@faeasyshop/common";
import { Order } from "../../orm/entity/order";
import { orderRepository } from "../../orm/repositories";




export async function createOrderCreatedEventValue(orderId:string){

    const order = await orderRepository.findOne({where:{id:orderId},relations:["orderProducts"]});

    if(!order){
        throw new Error("order not found ")
    }
    

    return {
        id: order.id,
        buyerId: order.buyerId,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        address: order.address,
        orderProducts: order.orderProducts
    } satisfies OrderCreatedEvent["value"]

}
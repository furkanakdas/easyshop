

import { Event } from "../event";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";
import { Currency } from "../../enums/currency";
import { OrderStatus } from "../../enums/order-status";

export interface OrderCreatedEvent extends Event {

    topic: Topics.ORDER_CREATED;
    valueSubject: ValueSubjects.ORDER_CREATED;
    value: {
        id: string,
        buyerId: string,
        status: OrderStatus,
        createdAt:Date,
        updatedAt:Date,
        address: {
            id: string,
            firstName: string,
            lastName: string,
            phone: string,
            city: string,
            district: string,
            neighbourhood: string,
            detailedAddress: string,
            title: string,
        },
        orderProducts: {
            id: string,
            orderId:string,
            productId: string,
            productName: string,
            price: number,
            currency: Currency,
            quantity: number,
            sellerId:string,
            description:string | null
        }[]
    };

}
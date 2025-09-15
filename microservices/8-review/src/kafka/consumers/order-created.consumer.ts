import { CompanyType, ConsumerManager, Currency, OrderCreatedEvent, OrderStatus, ProductCreatedEvent, SellerProfileCreatedEvent, SellerProfileStatus, Topics } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { orderRepository } from "../../orm/repositories";
import { Order } from "../../orm/entity/order";
import { OrderProduct } from "../../orm/entity/order-product";
import { StringValidation } from "zod";
import { DeepPartial } from "typeorm";




export class OrderCreatedConsumer extends ConsumerManager<OrderCreatedEvent> {



    topic: Topics.ORDER_CREATED = Topics.ORDER_CREATED;




    async processEvent(value:
        {
            id: string; buyerId: string; status: OrderStatus; createdAt: Date; updatedAt: Date;
            address: {
                id: string; firstName: string; lastName: string; phone: string;
                city: string; district: string; neighbourhood: string; detailedAddress: string; title: string;
            };
            orderProducts: {
                id: string; productId: string; productName: string; price: number; currency:
                Currency; quantity: number; sellerId:string ;description:string|null
            }[];
        }, event: KafkaMessage): Promise<void> {


        console.log("received message value: ", value);
        

        const orderProductsInput : DeepPartial<OrderProduct>[] = []  ;

        for (const orderProduct of value.orderProducts) {

            const orderProductInput = {

                id: orderProduct.id,
                productId: orderProduct.productId,
                sellerId: orderProduct.sellerId

            } satisfies  DeepPartial<OrderProduct>

            orderProductsInput.push(orderProductInput)
        }

        const orderInput = {
            id: value.id,
            buyerId: value.buyerId,
            orderProducts: [...orderProductsInput],
            status: value.status,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
        } satisfies DeepPartial<Order>



        const createdOrder = orderRepository.create(orderInput);

        await orderRepository.save(createdOrder);


        console.log("consumed message value: ", value);

    }











}










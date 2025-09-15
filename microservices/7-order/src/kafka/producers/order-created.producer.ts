import {  OrderCreatedEvent, ProducerManager,  ReviewCreatedEvent,  Topics,   ValueSubjects, } from "@faeasyshop/common";


export class OrderCreatedProducer extends ProducerManager<OrderCreatedEvent> {


    topic: Topics.ORDER_CREATED = Topics.ORDER_CREATED;
    valueSubject: ValueSubjects.ORDER_CREATED = ValueSubjects.ORDER_CREATED;

}
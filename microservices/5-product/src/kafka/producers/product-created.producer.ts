import {  ProducerManager,  ProductCreatedEvent,  ProductCreatedSearchEvent,  Topics,  UserRoleUpdatedEvent, ValueSubjects, } from "@faeasyshop/common";


export class ProductCreatedProducer extends ProducerManager<ProductCreatedEvent> {


    topic: Topics.PRODUCT_CREATED = Topics.PRODUCT_CREATED;
    valueSubject: ValueSubjects.PRODUCT_CREATED = ValueSubjects.PRODUCT_CREATED;

}
import {  ProducerManager,  ProductCreatedSearchEvent,  Topics,  UserRoleUpdatedEvent, ValueSubjects, } from "@faeasyshop/common";


export class ProductCreatedSearchProducer extends ProducerManager<ProductCreatedSearchEvent> {


    topic: Topics.PRODUCT_CREATED_SEARCH = Topics.PRODUCT_CREATED_SEARCH;
    valueSubject: ValueSubjects.PRODUCT_CREATED_SEARCH = ValueSubjects.PRODUCT_CREATED_SEARCH;

}
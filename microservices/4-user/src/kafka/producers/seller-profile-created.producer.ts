import {  ProducerManager,  SellerProfileCreatedEvent,  Topics,  UserRoleUpdatedEvent, ValueSubjects, } from "@faeasyshop/common";

export class SellerProfileCreatedProducer extends ProducerManager<SellerProfileCreatedEvent> {


    topic: Topics.SELLER_PROFILE_CREATED = Topics.SELLER_PROFILE_CREATED;
    valueSubject: ValueSubjects.SELLER_PROFILE_CREATED = ValueSubjects.SELLER_PROFILE_CREATED;




}
import {  ProducerManager,  SellerProfileCreatedEvent,  SellerProfileUpdatedEvent,  Topics,  UserRoleUpdatedEvent, ValueSubjects, } from "@faeasyshop/common";

export class SellerProfileUpdatedProducer extends ProducerManager<SellerProfileUpdatedEvent> {


    topic: Topics.SELLER_PROFILE_UPDATED = Topics.SELLER_PROFILE_UPDATED;
    valueSubject: ValueSubjects.SELLER_PROFILE_UPDATED = ValueSubjects.SELLER_PROFILE_UPDATED;




}
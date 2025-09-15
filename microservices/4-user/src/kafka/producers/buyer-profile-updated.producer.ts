import {  BuyerProfileCreatedEvent, BuyerProfileUpdatedEvent, ProducerManager,    Topics, ValueSubjects, } from "@faeasyshop/common";

export class BuyerProfileUpdatedProducer extends ProducerManager<BuyerProfileUpdatedEvent> {


    topic: Topics.BUYER_PROFILE_UPDATED = Topics.BUYER_PROFILE_UPDATED;
    valueSubject: ValueSubjects.BUYER_PROFILE_UPDATED = ValueSubjects.BUYER_PROFILE_UPDATED;


}
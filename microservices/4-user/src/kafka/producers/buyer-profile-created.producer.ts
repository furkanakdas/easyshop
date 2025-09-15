import {  BuyerProfileCreatedEvent, ProducerManager,    Topics, ValueSubjects, } from "@faeasyshop/common";

export class BuyerProfileCreatedProducer extends ProducerManager<BuyerProfileCreatedEvent> {


    topic: Topics.BUYER_PROFILE_CREATED = Topics.BUYER_PROFILE_CREATED;
    valueSubject: ValueSubjects.BUYER_PROFILE_CREATED = ValueSubjects.BUYER_PROFILE_CREATED;


}
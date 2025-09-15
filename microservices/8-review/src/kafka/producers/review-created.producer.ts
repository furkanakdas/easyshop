import {  ProducerManager,  ProductCreatedEvent,  ProductCreatedSearchEvent,  ReviewCreatedEvent,  Topics,  UserRoleUpdatedEvent, ValueSubjects, } from "@faeasyshop/common";


export class ReviewCreatedProducer extends ProducerManager<ReviewCreatedEvent> {


    topic: Topics.REVIEW_CREATED = Topics.REVIEW_CREATED;
    valueSubject: ValueSubjects.REVIEW_CREATED = ValueSubjects.REVIEW_CREATED;

}
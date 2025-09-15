import {  ProducerManager, Topics, UserCreatedEvent, UserUpdatedEvent, ValueSubjects, VerifyEmailEvent,registryWrapper } from "@faeasyshop/common";

export class UserUpdatedProducer extends ProducerManager<UserUpdatedEvent> {


    topic: Topics.USER_UPDATED = Topics.USER_UPDATED;
    valueSubject: ValueSubjects.USER_UPDATED = ValueSubjects.USER_UPDATED;






}
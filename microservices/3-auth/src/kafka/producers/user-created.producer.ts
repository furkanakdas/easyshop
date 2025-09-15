import {  ProducerManager, Topics, UserCreatedEvent, ValueSubjects, VerifyEmailEvent,registryWrapper } from "@faeasyshop/common";

export class UserCreatedProducer extends ProducerManager<UserCreatedEvent> {


    topic: Topics.USER_CREATED = Topics.USER_CREATED;
    valueSubject: ValueSubjects.USER_CREATED = ValueSubjects.USER_CREATED;

  

    



}
import {  ProducerManager,  Topics,  UserRoleUpdatedEvent, ValueSubjects, } from "@faeasyshop/common";

export class UserRoleUpdatedProducer extends ProducerManager<UserRoleUpdatedEvent> {


    topic: Topics.USER_ROLE_UPDATED = Topics.USER_ROLE_UPDATED;
    valueSubject: ValueSubjects.USER_ROLE_UPDATED = ValueSubjects.USER_ROLE_UPDATED;


}
import {  ProducerManager, Topics, ValueSubjects, VerifyEmailEvent,registryWrapper } from "@faeasyshop/common";

export class VerifyEmailProducer extends ProducerManager<VerifyEmailEvent> {


    topic: Topics.VERIFY_EMAIL = Topics.VERIFY_EMAIL;
    valueSubject: ValueSubjects.VERIFY_EMAIL = ValueSubjects.VERIFY_EMAIL;

 
}
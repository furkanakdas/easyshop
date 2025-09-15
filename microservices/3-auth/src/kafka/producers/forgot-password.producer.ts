import {  ForgotPasswordEvent, ProducerManager, Topics, ValueSubjects, VerifyEmailEvent,registryWrapper } from "@faeasyshop/common";

export class ForgotPasswordProducer extends ProducerManager<ForgotPasswordEvent> {


    topic: Topics.FORGOT_PASSWORD = Topics.FORGOT_PASSWORD;
    valueSubject: ValueSubjects.FORGOT_PASSWORD = ValueSubjects.FORGOT_PASSWORD;

}
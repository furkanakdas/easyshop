import {  ProducerManager, Topics, ValueSubjects, VerifyEmailEvent,VerifyOtpEvent,registryWrapper } from "@faeasyshop/common";

export class VerifyOtpProducer extends ProducerManager<VerifyOtpEvent> {


    topic: Topics.VERIFY_OTP = Topics.VERIFY_OTP;
    valueSubject: ValueSubjects.VERIFY_OTP = ValueSubjects.VERIFY_OTP;

 
}
import { Event } from "../event";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";

export interface VerifyOtpEvent extends Event   {

    topic:Topics.VERIFY_OTP;
    valueSubject:ValueSubjects.VERIFY_OTP;
    value:{
        receiverEmail:string;
        verifyLink:string;
    };

    
}

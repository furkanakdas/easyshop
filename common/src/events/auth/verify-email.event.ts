

import { Event } from "../event";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";

export interface VerifyEmailEvent extends Event   {

    topic:Topics.VERIFY_EMAIL;
    valueSubject:ValueSubjects.VERIFY_EMAIL;
    value:{
        receiverEmail:string;
        verifyLink:string;
    };

    
}








import { Event } from "../event";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";

export interface ForgotPasswordEvent extends Event   {

    topic:Topics.FORGOT_PASSWORD;
    valueSubject:ValueSubjects.FORGOT_PASSWORD;
    value:{
        receiverEmail:string;
        resetLink:string;
    };
    
}



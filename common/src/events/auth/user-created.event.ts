

import { Event } from "../event";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";
import { UserRole } from "../../enums/user-role";

export interface UserCreatedEvent extends Event   {

    topic:Topics.USER_CREATED;
    valueSubject:ValueSubjects.USER_CREATED;
    value:{
        id:string,
        email:string,
        role:UserRole,
        isEmailVerified:boolean,
        lastLoginAt:Date | null,
        createdAt:Date,
        updatedAt:Date
    };

    
    
}




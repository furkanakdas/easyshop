import { Topics } from "../../enums/topics";
import { UserRole } from "../../enums/user-role";
import { ValueSubjects } from "../../enums/value-subjects";




export interface UserUpdatedEvent extends Event   {

    topic:Topics.USER_UPDATED;
    valueSubject:ValueSubjects.USER_UPDATED;
    value:{
        id:string,
        email:string,
        role:UserRole,
        isEmailVerified:boolean,
        lastLoginAt:Date | null ,
        createdAt:Date,
        updatedAt:Date
    };
    
}






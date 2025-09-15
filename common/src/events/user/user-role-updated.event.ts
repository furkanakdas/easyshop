import { Event } from "../event";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";
import { UserRole } from "../../enums/user-role";

export interface UserRoleUpdatedEvent extends Event   {

    topic:Topics.USER_ROLE_UPDATED;
    valueSubject:ValueSubjects.USER_ROLE_UPDATED;
    value:{
        id:string
        role:UserRole,
    };

}
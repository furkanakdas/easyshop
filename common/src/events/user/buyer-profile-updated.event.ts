import { Event } from "../event";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";
import { UserRole } from "../../enums/user-role";
import { CompanyType } from "../../enums/company-type";
import { SellerProfileStatus } from "../../enums/seller-profile-status";

export interface BuyerProfileUpdatedEvent extends Event   {

    topic:Topics.BUYER_PROFILE_UPDATED;
    valueSubject:ValueSubjects.BUYER_PROFILE_UPDATED;
    value:{
        userId:string,
        firstName:string|null,
        lastName:string|null,
        addresses:{
            id:string,
            firstName:string,
            lastName:string,
            phone:string,
            city:string,
            district:string,
            neighbourhood:string,
            detailedAddress:string,
            title:string,
        }[]
    };

}
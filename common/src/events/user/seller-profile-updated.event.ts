

import { Event } from "../event";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";
import { UserRole } from "../../enums/user-role";
import { CompanyType } from "../../enums/company-type";
import { SellerProfileStatus } from "../../enums/seller-profile-status";

export interface SellerProfileUpdatedEvent extends Event   {

    topic:Topics.SELLER_PROFILE_UPDATED;
    valueSubject:ValueSubjects.SELLER_PROFILE_UPDATED;
    value:{
        userId:string,
        email:string,
        phone:string,
        identityNumber:string,
        businessName:string,
        businessDescription:string | null,
        companyType:CompanyType,
        stripeAccountId:string,
        iban:string,
        taxId:string,
        createdAt:Date,
        status:SellerProfileStatus
    };

}





import { CompanyType, ConsumerManager, ForgotPasswordEvent, SellerProfileCreatedEvent, SellerProfileStatus, Topics, UserCreatedEvent, UserRole, VerifyEmailEvent, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { sellerProfileRepository } from "../../orm/repositories";




export class SellerProfileCreatedConsumer extends ConsumerManager<SellerProfileCreatedEvent> {
 


    topic: Topics.SELLER_PROFILE_CREATED = Topics.SELLER_PROFILE_CREATED;

    async processEvent(value: { userId: string; email: string;
         phone: string; identityNumber: string; businessName: string;
          businessDescription: string | null; companyType: CompanyType;
           stripeAccountId: string; iban: string; taxId: string; createdAt: Date; 
           status: SellerProfileStatus; }, event: KafkaMessage): Promise<void> {
        
        
        const user = sellerProfileRepository.create({userId:value.userId,stripeAccountId:value.stripeAccountId});

        await sellerProfileRepository.save(user);
        
        console.log("consumed value:",value);

    }

}





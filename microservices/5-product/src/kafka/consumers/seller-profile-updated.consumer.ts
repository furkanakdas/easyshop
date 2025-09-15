import { CompanyType, ConsumerManager, ForgotPasswordEvent, SellerProfileCreatedEvent, SellerProfileStatus, SellerProfileUpdatedEvent, Topics, UserCreatedEvent, UserRole, VerifyEmailEvent, loggerWrapper, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { sellerProfileRepository } from "../../orm/repositories";




export class SellerProfileUpdatedConsumer extends ConsumerManager<SellerProfileUpdatedEvent> {
 


    topic: Topics.SELLER_PROFILE_UPDATED = Topics.SELLER_PROFILE_UPDATED;

    async processEvent(value: { userId: string; email: string;
         phone: string; identityNumber: string; businessName: string;
          businessDescription: string | null; companyType: CompanyType;
           stripeAccountId: string; iban: string; taxId: string; createdAt: Date; 
           status: SellerProfileStatus; }, event: KafkaMessage): Promise<void> {
        
        
        const user = sellerProfileRepository.create({userId:value.userId,stripeAccountId:value.stripeAccountId});

        await sellerProfileRepository.save(user);
        

        loggerWrapper.info("consumed value",{value:value})

    }

}





import { CompanyType, ConsumerManager, Currency, ProductCreatedEvent, SellerProfileCreatedEvent, SellerProfileStatus, Topics } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { productRepository, sellerProfileRepository } from "../../orm/repositories";
import { SellerProfile } from "../../orm/entity/seller-profile";




export class SellerProfileCreatedConsumer extends ConsumerManager<SellerProfileCreatedEvent> {


    topic: Topics.SELLER_PROFILE_CREATED = Topics.SELLER_PROFILE_CREATED;



    async processEvent(value: {
        userId: string; email: string; phone: string; identityNumber: string;
        businessName: string; businessDescription: string | null; companyType: CompanyType; stripeAccountId: string;
        iban: string; taxId: string; createdAt: Date; status: SellerProfileStatus;
    },
        event: KafkaMessage): Promise<void> {


            console.log(value);
            

        const extractedValue = {
            userId:value.userId,
            email:value.email,
            businessName:value.businessName,
            businessDescription:value.businessDescription,
            companyType:value.companyType,
            stripeAccountId:value.stripeAccountId,
            createdAt:value.createdAt,
            status:value.status
        } satisfies SellerProfile


        const createdSellerProfile = sellerProfileRepository.create(extractedValue) 



        const savedSellerProfile = await sellerProfileRepository.save(createdSellerProfile);



        console.log("consumed value:", value);

    }







}










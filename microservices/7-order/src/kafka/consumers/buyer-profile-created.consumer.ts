import { BuyerProfileCreatedEvent, CompanyType, ConsumerManager, Currency, ProductCreatedEvent, SellerProfileCreatedEvent, SellerProfileStatus, Topics } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { buyerProfileRepository, cartRepository, productRepository, sellerProfileRepository } from "../../orm/repositories";
import { SellerProfile } from "../../orm/entity/seller-profile";
import { BuyerProfile } from "../../orm/entity/buyer-profile";




export class BuyerProfileCreatedConsumer extends ConsumerManager<BuyerProfileCreatedEvent> {



    topic: Topics.BUYER_PROFILE_CREATED = Topics.BUYER_PROFILE_CREATED;



    async processEvent(value:
        {
            userId: string; firstName: string | null; lastName: string | null;
            addresses:
            {
                id: string; firstName: string; lastName: string; phone: string; city: string;
                district: string; neighbourhood: string; detailedAddress: string; title: string;
            }[];
        }, event: KafkaMessage): Promise<void> {

        console.log("consumed value:", value);


        const extractedValue = {
            userId: value.userId,
            addresses: value.addresses,
        } satisfies BuyerProfile



        const createdBuyerProfile = buyerProfileRepository.create(extractedValue)

        await buyerProfileRepository.save(createdBuyerProfile);


        const newCart = cartRepository.create({
            buyerId: createdBuyerProfile.userId,
        });

        await cartRepository.save(newCart);



        console.log("consuming complete");

    }







}










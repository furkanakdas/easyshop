import { ConsumerManager, ForgotPasswordEvent, Topics, UserCreatedEvent, UserRole, VerifyEmailEvent, producerWrapper, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { config } from "../../config";
import { prisma } from "../../server/clients/database.client";
import { $Enums, Prisma } from "@prisma/client";
import { date } from "zod";
import { BuyerProfileCreatedProducer } from "../producers/buyer-profile-created.producer";
import { createBuyerProfileEventValue } from "../../server/event-value-creaters/buyer-profile.event-creater";




export class UserCreatedConsumer extends ConsumerManager<UserCreatedEvent> {


    topic: Topics.USER_CREATED = Topics.USER_CREATED;

    async processEvent(value: {
        id: string; email: string; role: UserRole;
        isEmailVerified: boolean; lastLoginAt: Date | null;
        createdAt: Date; updatedAt: Date;
    }, event: KafkaMessage) {

        

        const userCreate: Prisma.UserCreateInput = value satisfies Prisma.UserCreateInput

        const buyerProfile = await prisma.$transaction(async tx => {


            await tx.user.create({ data: userCreate });

            const createdBuyerProfile = await tx.buyerProfile.create({ data: { userId: userCreate.id } });


            const eventValue = await createBuyerProfileEventValue(tx,createdBuyerProfile.userId);


            const buyerProfileCreatedEventOutbox = await tx.outboxEvent.create({
                data: {
                    aggregateId: createdBuyerProfile.userId,
                    topic: Topics.BUYER_PROFILE_CREATED,
                    value: eventValue,
                }
            })

            return createdBuyerProfile

        })









    }


}





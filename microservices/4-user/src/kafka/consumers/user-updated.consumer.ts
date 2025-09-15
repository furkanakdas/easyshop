import { ConsumerManager, ForgotPasswordEvent, Topics, UserCreatedEvent, UserRole, UserUpdatedEvent, VerifyEmailEvent, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { config } from "../../config";
import { prisma } from "../../server/clients/database.client";
import { Prisma } from "@prisma/client";




export class UserUpdatedConsumer extends ConsumerManager<UserUpdatedEvent> {


    topic: Topics.USER_UPDATED = Topics.USER_UPDATED;

    async processEvent(value: {
        id: string; email: string; role: UserRole;
        isEmailVerified: boolean; lastLoginAt: Date | null;
        createdAt: Date; updatedAt: Date;
    }, event: KafkaMessage) {

        console.log("consumed value:",value);

        
        await prisma.user.update({where:{id:value.id},data:value});

    }


}
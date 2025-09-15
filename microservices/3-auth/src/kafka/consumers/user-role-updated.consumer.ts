import { ConsumerManager, ForgotPasswordEvent, Topics, UserRole, UserRoleUpdatedEvent, VerifyEmailEvent, producerWrapper, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { config } from "../../config";
import { prisma } from "../../server/clients/database.client";
import { UserUpdatedProducer } from "../producers/user-updated.producer";
import { createUserUpdatedEventValue } from "../../server/event-value-creaters/create-user-updated-event-value";



export class UserRoleUpdatedConsumer extends ConsumerManager<UserRoleUpdatedEvent> {



    topic: Topics.USER_ROLE_UPDATED = Topics.USER_ROLE_UPDATED;


    async processEvent(value: { id: string; role: UserRole; }, event: KafkaMessage): Promise<void> {

        await prisma.$transaction(async tx => {

            const updatedUser = await tx.user.update({ where: { id: value.id }, data: { role: value.role } });
            const userUpdatedEventValue = await createUserUpdatedEventValue(updatedUser);
            
            const userUpdatedEventOutbox = await tx.outboxEvent.create({
                data: {
                    aggregateId: updatedUser.id,
                    topic: Topics.USER_UPDATED,
                    value: userUpdatedEventValue
                }
            })

        })
    }

}

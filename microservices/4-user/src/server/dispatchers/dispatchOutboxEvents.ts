import { BuyerProfileCreatedEvent, BuyerProfileUpdatedEvent, ForgotPasswordEvent, loggerWrapper, producerWrapper, SellerProfileCreatedEvent, SellerProfileUpdatedEvent, Topics, UserCreatedEvent, UserRoleUpdatedEvent, UserUpdatedEvent, VerifyEmailEvent, VerifyOtpEvent } from "@faeasyshop/common";
import { prisma } from "../clients/database.client";
import { BuyerProfileCreatedProducer } from "../../kafka/producers/buyer-profile-created.producer";
import { BuyerProfileUpdatedProducer } from "../../kafka/producers/buyer-profile-updated.producer";
import { SellerProfileCreatedProducer } from "../../kafka/producers/seller-profile-created.producer";
import { SellerProfileUpdatedProducer } from "../../kafka/producers/seller-profile-updated.producer";
import { UserCreatedConsumer } from "../../kafka/consumers/user-created.consumer";
import { UserRoleUpdatedProducer } from "../../kafka/producers/user-role-updated.producer";



async function dispatchOutboxEvents() {



    try {

        const events = await prisma.outboxEvent.findMany({ where: { processed: false }, orderBy: { occurredAt: 'asc' }, take: 10 });

        try {
            for (const event of events) {

                if (event.topic == Topics.BUYER_PROFILE_CREATED) {

                    const producer = new BuyerProfileCreatedProducer();
                    await producer.send(event.value as any as BuyerProfileCreatedEvent["value"], event.aggregateId)

                } else if (event.topic == Topics.BUYER_PROFILE_UPDATED) {

                    const producer = new BuyerProfileUpdatedProducer();
                    await producer.send(event.value as any as BuyerProfileUpdatedEvent["value"], event.aggregateId)

                } else if (event.topic == Topics.SELLER_PROFILE_CREATED) {

                    const producer = new SellerProfileCreatedProducer();
                    await producer.send(event.value as any as SellerProfileCreatedEvent["value"], event.aggregateId)

                } else if (event.topic == Topics.SELLER_PROFILE_UPDATED) {

                    const producer = new SellerProfileUpdatedProducer();
                    await producer.send(event.value as any as SellerProfileUpdatedEvent["value"], event.aggregateId)

                } else if (event.topic == Topics.USER_ROLE_UPDATED) {
                    const producer = new UserRoleUpdatedProducer();
                    await producer.send(event.value as any as UserRoleUpdatedEvent["value"], event.aggregateId)
                } else {

                    loggerWrapper.warn(` ${event.topic} event is not dispatching`, { from: "dispatchOutboxEvents" })
                    continue;
                }

                loggerWrapper.info(`${event.topic} event is send`, { value: event.value, from: "dispatchOutboxEvents" });


                await prisma.outboxEvent.update({ where: { id: event.id }, data: { processed: true } });

            }
        } catch (err) {
            if(err instanceof Error)
            loggerWrapper.error("An error occured  while dispatching events", { error: err.message, from: "dispatchOutboxEvents" });
        }

    } catch (error) {
        loggerWrapper.error(error);
    }




}

let interval: NodeJS.Timeout | null = null;

export function startDispatchingOutboxEvents() {

    if (interval == null) {
        interval = setInterval(dispatchOutboxEvents, 1000);
        loggerWrapper.info("DispatchingOutboxEvents started", { from: "startDispatchingOutboxEvents" })
    }

}


export function stopDispatchingOutboxEvents() {

    if (interval != null) {
        clearInterval(interval);
        interval = null;
        loggerWrapper.info("DispatchingOutboxEvents stopped", { from: "stopDispatchingOutboxEvents" })
    }

}

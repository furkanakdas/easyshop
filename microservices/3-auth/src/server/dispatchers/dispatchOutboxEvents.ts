import { ForgotPasswordEvent, loggerWrapper, producerWrapper, Topics, UserCreatedEvent, UserUpdatedEvent, VerifyEmailEvent, VerifyOtpEvent } from "@faeasyshop/common";
import { prisma } from "../clients/database.client";
import { UserCreatedProducer } from "../../kafka/producers/user-created.producer";
import { UserUpdatedProducer } from "../../kafka/producers/user-updated.producer";
import { ForgotPasswordProducer } from "../../kafka/producers/forgot-password.producer";
import { VerifyEmailProducer } from "../../kafka/producers/verify-email.producer";
import { VerifyOtpProducer } from "../../kafka/producers/verify-otp.producer";



async function dispatchOutboxEvents() {


    try {
        let events = await prisma.outboxEvent.findMany({ where: { processed: false }, orderBy: { occurredAt: 'asc' }, take: 10 });

        try {
            for (const event of events) {

                if (event.topic == Topics.USER_CREATED) {

                    const producer = new UserCreatedProducer();
                    await producer.send(event.value as any as UserCreatedEvent["value"], event.aggregateId)

                } else if (event.topic == Topics.USER_UPDATED) {

                    const producer = new UserUpdatedProducer();
                    await producer.send(event.value as any as UserUpdatedEvent["value"], event.aggregateId)

                } else if (event.topic == Topics.FORGOT_PASSWORD) {

                    const producer = new ForgotPasswordProducer();
                    await producer.send(event.value as any as ForgotPasswordEvent["value"], event.aggregateId)

                } else if (event.topic == Topics.VERIFY_EMAIL) {

                    const producer = new VerifyEmailProducer();
                    await producer.send(event.value as any as VerifyEmailEvent["value"], event.aggregateId)

                } else if (event.topic == Topics.VERIFY_OTP) {
                    const producer = new VerifyOtpProducer();
                    await producer.send(event.value as any as VerifyOtpEvent["value"], event.aggregateId)
                } else {

                    loggerWrapper.warn(` ${event.topic} event is not dispatching`, { from: "dispatchOutboxEvents" })
                    continue;
                }

                loggerWrapper.info(`${event.topic} event is send`, { value: event.value, from: "dispatchOutboxEvents" });


                await prisma.outboxEvent.update({ where: { id: event.id }, data: { processed: true } });

            }
        }
        catch (err) {
            loggerWrapper.error("An error occured  while dispatching events", { from: "dispatchOutboxEvents" });
        }

    } catch (error) {
        loggerWrapper.error(error)
    }
}

let interval: NodeJS.Timeout | null = null;

export function startDispatchingOutboxEvents() {

    if (interval == null) {
        interval = setInterval(dispatchOutboxEvents, 10000);
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

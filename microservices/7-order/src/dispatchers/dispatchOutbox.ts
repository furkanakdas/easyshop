import { loggerWrapper, OrderCreatedEvent, Topics } from "@faeasyshop/common";
import { stripe } from "../clients/stripe.client";
import { outboxEventRepository, outboxStripeTransfersRepository } from "../orm/repositories";
import { OrderCreatedProducer } from "../kafka/producers/order-created.producer";
import { createOrderCreatedEventValue } from "../server/event-value-creaters/order-created-event-value-creater";



async function dispatchOutboxEvents() {


    try {



        const events = await outboxEventRepository.find({ where: { processed: false }, order: { occuredAt: 'ASC', }, take: 10 });

        try {
            for (const event of events) {



                if (event.topic == Topics.ORDER_CREATED) {
                    const producer = new OrderCreatedProducer();
                    await producer.send(event.value as OrderCreatedEvent["value"], event.aggregateId);
                } else {

                    loggerWrapper.warn(` ${event.topic} event is not dispatching`)
                    continue;
                }

                loggerWrapper.info(`${event.topic} event is send`, { value: event.value });

                event.processed = true;
                await outboxEventRepository.save(event);

            }
        }
        catch (err) {
            loggerWrapper.error("An error occured  while dispatching events", { error: err });
        }
    } catch (error) {
            loggerWrapper.error(error);

    }
}


async function dispatchOutboxTransfers() {

    const transferOutboxs = await outboxStripeTransfersRepository.find({ where: { processed: false } });



    for (const transferOutbox of transferOutboxs) {

        const sellers = transferOutbox.sellerGroups

        const processedTransfers = transferOutbox.processedTransfers;


        try {

            for (const seller of sellers) {

                if (processedTransfers.find(transfer => transfer.sellerStripeAccountId == seller.sellerStripeAccountId)) {

                    continue;
                }
                const transfer = await stripe.transfers.create({
                    amount: seller.amount,
                    currency: 'usd',
                    destination: seller.sellerStripeAccountId,
                    transfer_group: transferOutbox.paymentIntentId,
                });

                loggerWrapper.info("transfer created", { destination: transfer.destination, amount: transfer.amount });

                processedTransfers.push({ sellerStripeAccountId: seller.sellerStripeAccountId });
            }

            transferOutbox.processed = true;

        } catch (error) {
            loggerWrapper.error(error)
            transferOutbox.processed = false;
        }

        transferOutbox.processedTransfers = processedTransfers;
        await outboxStripeTransfersRepository.save(transferOutbox);

    }


}





let intervalEvents: NodeJS.Timeout | null = null;
let intervalTransfers: NodeJS.Timeout | null = null;


export function startDispatchingOutbox() {

    loggerWrapper.info("dispatching outbox started")

    if (intervalEvents == null) {
        intervalEvents = setInterval(dispatchOutboxEvents, 10000);
    }

    if (intervalTransfers == null) {
        intervalTransfers = setInterval(dispatchOutboxTransfers, 10000);
    }

}


export function stopDispatchingOutbox() {

    loggerWrapper.info("dispatching outbox stopped")


    if (intervalEvents != null) {
        clearInterval(intervalEvents);
        intervalEvents = null;
    }

    if (intervalTransfers != null) {
        clearInterval(intervalTransfers);
        intervalTransfers = null;
    }

}

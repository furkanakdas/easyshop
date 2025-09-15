import { loggerWrapper, producerWrapper, Topics } from "@faeasyshop/common";
import { ProductCreatedProducer } from "../../kafka/producers/product-created.producer";
import { outboxEventRepository } from "../../orm/repositories";
import { ProductCreatedSearchProducer } from "../../kafka/producers/product-created-search.producer";


export async function dispatchOutboxEvents() {


    try {
        const events = await outboxEventRepository.find({ where: { processed: false }, order: { occurredAt: 'ASC', }, take: 10 });

        try {

            for (const event of events) {

                if (event.eventType == Topics.PRODUCT_CREATED) {

                    const productCreatedProducer = new ProductCreatedProducer();
                    await productCreatedProducer.send(event.payload);

                } else if (event.eventType == Topics.PRODUCT_CREATED_SEARCH) {
                    const productCreatedSearchProducer = new ProductCreatedSearchProducer();
                    await productCreatedSearchProducer.send(event.payload);
                }

                loggerWrapper.info(`${event.eventType} event is send`, { value: event.payload, from: "dispatchOutboxEvents" });

                await outboxEventRepository.update(event.id, { processed: true });
            }

        } catch (err) {
            loggerWrapper.error('Kafka publish error:', { err });
        }

    } catch (error) {
        loggerWrapper.error(error);

    }
}


export function startDispatchingEvents(){
    setInterval(dispatchOutboxEvents, 5000);
}


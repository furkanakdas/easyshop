import { ConsumerManager, Currency, ProductCreatedEvent, Topics } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { productRepository, reservationRepository } from "../../orm/repositories";
import { Reservation } from "../../orm/entity/reservation";
import { DeepPartial } from "typeorm";




export class ProductCreatedConsumer extends ConsumerManager<ProductCreatedEvent> {


    topic: Topics.PRODUCT_CREATED = Topics.PRODUCT_CREATED;



    async processEvent(value: {
        id: string; name: string; description: string | null; price: number;
        currency: Currency; createdAt: Date; updatedAt: Date; stripePriceId: string; stripeProductId: string;
        categoryId: string; sellerId: string; attributes: {
            attributeDefinitionId: string; name: string; value:
            string; unit: string | null;
        }[]; tagsIds: string[]; inventory: { id: string; quantity: number; };
    },
        event: KafkaMessage): Promise<void> {


        const prevReservation = await reservationRepository.findOne({ where: { productId: value.id } })

        let reservation = prevReservation ?? undefined
        if (!reservation) {
            reservation = reservationRepository.create({
                productId: value.id
            });
            // await reservationRepository.save(newReservation)
        }

        const createdProduct = productRepository.create({
            id: value.id,
            name: value.name,
            description: value.description,
            price: value.price,
            currency: value.currency,
            createdAt: value.createdAt,
            updatedAt: value.updatedAt,
            sellerId: value.sellerId,
            quantity: value.inventory.quantity,
            stripePriceId: value.stripePriceId,
            stripeProductId: value.stripeProductId,
            reservation: reservation
        })


        const savedValue = await productRepository.save(createdProduct)


        console.log("consumed value:", value);
    }




}





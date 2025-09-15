import { startHttpServer } from "./server/server"
import { config } from "./config";
import { ShutdownManager } from "./shutdownManager";
import { prisma } from "./server/clients/database.client";
import { z } from "zod";
import { consumerWrapper, kafkaClientWrapper,  loggerWrapper, producerWrapper, registryWrapper, UserRole } from "@faeasyshop/common";
import { UserCreatedConsumer } from "./kafka/consumers/user-created.consumer";
import { UserUpdatedConsumer } from "./kafka/consumers/user-updated.consumer";
import { stripe } from "./server/clients/stripe.client";
import { elasticClient } from "./server/clients/elasticsearch.client";
import { UserRoleUpdatedProducer } from "./kafka/producers/user-role-updated.producer";
import { SchemaType } from "@kafkajs/confluent-schema-registry";
import fs from 'fs';
import path from 'path';
import { BuyerProfileCreatedProducer } from "./kafka/producers/buyer-profile-created.producer";
import { BuyerProfileUpdatedProducer } from "./kafka/producers/buyer-profile-updated.producer";
import { SellerProfileCreatedProducer } from "./kafka/producers/seller-profile-created.producer";
import { SellerProfileUpdatedProducer } from "./kafka/producers/seller-profile-updated.producer";
import { startDispatchingOutboxEvents, stopDispatchingOutboxEvents } from "./server/dispatchers/dispatchOutboxEvents";

const shutdown = new ShutdownManager();



async function main() {

    await loggerWrapper.initiate(elasticClient, { service: "user" })

    await setupDB();

    await setupHttpServer();
    await setupSchemaRegistry()

    await setupKafka();

}


async function setupSchemaRegistry() {




    try {

        await registryWrapper.initiate(config.SCHEMA_REGISTRY_URL);


        await registerSchemaIfNotExists(new BuyerProfileCreatedProducer().valueSubject, ["kafka", "schemas", "buyer-profile-created.event.schema.json"], 1);
        await registerSchemaIfNotExists(new BuyerProfileUpdatedProducer().valueSubject, ["kafka", "schemas", "buyer-profile-updated.event.schema.json"], 1);

        await registerSchemaIfNotExists(new SellerProfileCreatedProducer().valueSubject, ["kafka", "schemas", "seller-profile-created.event.schema.json"], 1);
        await registerSchemaIfNotExists(new SellerProfileUpdatedProducer().valueSubject, ["kafka", "schemas", "seller-profile-updated.event.schema.json"], 1);
        await registerSchemaIfNotExists(new UserRoleUpdatedProducer().valueSubject, ["kafka", "schemas", "user-role-updated.event.schema.json"], 1);


    } catch (error) {
        loggerWrapper.error(error)
    }




}


async function registerSchemaIfNotExists(subject: string, paths: string[], version: number) {

    const schemaPath = path.join(__dirname, ...paths);
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    try {
        console.log(version);

        // Mevcut şema zaten varsa, onun ID'sini getirir.
        const id = await registryWrapper.schemaRegistry.getRegistryId(subject, version);

        loggerWrapper.info(`Schema already registered with ID: ${id}`)
        return id;
    } catch (err) {

        const error = err as any

        if (error.status === 404) {
            const { id } = await registryWrapper.schemaRegistry.register({
                type: SchemaType.JSON,
                schema: schemaContent,
            }, { subject });

            loggerWrapper.info(`New schema registered with ID: ${id}`);
            return id;
        } else {
            throw error;
        }
    }
}



async function setupDB() {


    shutdown.register(async () => {
        console.log('Closing db connection ...');
        await prisma.$disconnect();
    });

    try {
        await prisma.$connect();
        loggerWrapper.info("db connection set")
    } catch (error) {
        loggerWrapper.error(error);
        process.exit(1);
    }
}

async function setupHttpServer() {

    const server = startHttpServer();

    shutdown.register(async () => {
        console.log('Closing http server ...');
        server.close();
    });

}



async function setupKafka() {

    await kafkaClientWrapper.initiate({
        clientId: "user-service",
        brokers: [config.KAFKA_URL],
        retry: {
            retries: 20,
            maxRetryTime: 60 * 1000,
            restartOnFailure(e: Error): Promise<boolean> {

                loggerWrapper.error(e);

                return new Promise<boolean>((resolve, reject) => {
                    resolve(true)
                });
            },
        }
    });




 
    consumerWrapper.initiate(kafkaClientWrapper.kafka, { groupId: "user-consumer-group-id" });
    producerWrapper.initiate(kafkaClientWrapper.kafka, {});


    await producerWrapper.producer.connect();

    const userCreatedConsumer = new UserCreatedConsumer();
    await userCreatedConsumer.subscribe(true);

    const userUpdatedConsumer = new UserUpdatedConsumer();
    await userUpdatedConsumer.subscribe(true);

    consumerWrapper.consumeManagers = [userCreatedConsumer, userUpdatedConsumer];

    await consumerWrapper.run();

    shutdown.register(async () => {

        console.log('Stopping Kafka consumer...');
        await consumerWrapper.consumer.stop();

        console.log('Disconnecting Kafka consumer...');
        await consumerWrapper.consumer.disconnect();


        console.log('Disconnecting Kafka producer...');
        await producerWrapper.producer.disconnect();
    });


    startDispatchingOutboxEvents();
    

}

main()

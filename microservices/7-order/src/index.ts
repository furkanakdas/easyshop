import { startHttpServer } from "./server/server"
import { ShutdownManager } from "./shutdownManager";
import { consumerWrapper, kafkaClientWrapper, kafkaLogCreator,  loggerWrapper, producerWrapper, registryWrapper } from "@faeasyshop/common";
import { initializeAppDataSource } from "./orm/initialize";
import { AppDataSource } from "./orm/data-source";
import { ProductCreatedConsumer } from "./kafka/consumers/product-created.consumer";
import { SellerProfileCreatedConsumer } from "./kafka/consumers/seller-profile-created.consumer";
import { BuyerProfileCreatedConsumer } from "./kafka/consumers/buyer-profile-created.consumer";
import { SellerProfileCUpdatedConsumer } from "./kafka/consumers/seller-profile-updated.consumer";
import { BuyerProfileUpdatedConsumer } from "./kafka/consumers/buyer-profile-updated.consumer";
import { elasticClient } from "./clients/elasticsearch.client";
import { logLevel } from "kafkajs";
import { startDispatchingOutbox, stopDispatchingOutbox } from "./dispatchers/dispatchOutbox";
import fs from 'fs';
import path from 'path';
import { OrderCreatedProducer } from "./kafka/producers/order-created.producer";
import { SchemaType } from "@kafkajs/confluent-schema-registry";
import { config } from "./config";



const shutdown = new ShutdownManager();



async function main() {

  

    await loggerWrapper.initiate(elasticClient, { service: "order" })


    await setupDB();

    await setupHttpServer();

    await setupSchemaRegistry()

    await setupKafka();


}




async function setupSchemaRegistry() {




    try {

        await registryWrapper.initiate(config.SCHEMA_REGISTRY_URL);


        await registerSchemaIfNotExists(new OrderCreatedProducer().valueSubject, ["kafka", "schemas", "order-created.event.schema.json"],1);

    } catch (error) {
        loggerWrapper.error(error)
    }




}


async function registerSchemaIfNotExists(subject: string, paths: string[], version: number) {

    const schemaPath = path.join(__dirname, ...paths);
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    try {

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


    try {
        await initializeAppDataSource();
        loggerWrapper.info("database connected")
    } catch (error) {
        loggerWrapper.error(error)
        process.exit(1);
    }


    shutdown.register(async () => {
        console.log('Closing db connection ...');
        AppDataSource.destroy()
    });

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
        clientId: "order-service",
        brokers: [config.KAFKA_URL],

        retry: {
            retries: 10,
            maxRetryTime: 60 * 1000,
            restartOnFailure: async (error: Error): Promise<boolean> => {

                loggerWrapper.error(error.message, { stack: error.stack });
                return new Promise<boolean>((resolve, reject) => {

                    resolve(true)
                });
            }
        },
        logLevel: logLevel.DEBUG,
        logCreator: kafkaLogCreator(loggerWrapper.logger),
    });


   
    consumerWrapper.initiate(kafkaClientWrapper.kafka, { groupId: "order-consumer-group-id" });
    producerWrapper.initiate(kafkaClientWrapper.kafka, {});


    await consumerWrapper.consumer.connect();
    await producerWrapper.producer.connect();

    shutdown.register(async () => {
        console.log('Disconnecting Kafka producer...');
        await producerWrapper.producer.disconnect();
    });

    shutdown.register(async () => {

        console.log('Stopping Kafka consumer...');
        await consumerWrapper.consumer.stop();

        console.log('Disconnecting Kafka consumer...');
        await consumerWrapper.consumer.disconnect();
    });


    const productCreatedConsumer = new ProductCreatedConsumer();
    await productCreatedConsumer.subscribe(true);

    const sellerProfileCreatedConsumer = new SellerProfileCreatedConsumer();
    await sellerProfileCreatedConsumer.subscribe(true);

    const sellerProfileUpdatedConsumer = new SellerProfileCUpdatedConsumer();
    await sellerProfileUpdatedConsumer.subscribe(true);

    const buyerProfileCreatedConsumer = new BuyerProfileCreatedConsumer();
    await buyerProfileCreatedConsumer.subscribe(true);

    const buyerProfileUpdatedConsumer = new BuyerProfileUpdatedConsumer();
    await buyerProfileUpdatedConsumer.subscribe(true);

    consumerWrapper.consumeManagers = [

        productCreatedConsumer,

        sellerProfileCreatedConsumer,
        sellerProfileUpdatedConsumer,

        buyerProfileCreatedConsumer,
        buyerProfileUpdatedConsumer,

    ];

    await consumerWrapper.run();

    startDispatchingOutbox();


}

main()

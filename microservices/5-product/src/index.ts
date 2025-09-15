import { startHttpServer } from "./server/server"
import { ShutdownManager } from "./shutdownManager";
import { consumerWrapper, kafkaClientWrapper,  loggerWrapper, producerWrapper, registryWrapper } from "@faeasyshop/common";
import { initializeAppDataSource } from "./orm/initialize";
import { AppDataSource } from "./orm/data-source";
import { SellerProfileCreatedConsumer } from "./kafka/consumers/seller-profile-created.consumer";
import { SellerProfileUpdatedConsumer } from "./kafka/consumers/seller-profile-updated.consumer";
import { elasticClient } from "./server/clients/elasticsearch.client";
import { ProductCreatedSearchProducer } from "./kafka/producers/product-created-search.producer";
import { ProductCreatedProducer } from "./kafka/producers/product-created.producer";
import fs from 'fs';
import path from 'path';
import { SchemaType } from "@kafkajs/confluent-schema-registry";
import { config } from "./config";
import { startDispatchingEvents } from "./server/dispatchers/dispatchOutboxEvents";



const shutdown = new ShutdownManager();



async function main() {


    await loggerWrapper.initiate(elasticClient, { service: "product" })




    await setupDB();

    await setupHttpServer();

    await setupSchemaRegistry()

    await setupKafka();

    
}



async function setupSchemaRegistry() {




    try {

        await registryWrapper.initiate(config.SCHEMA_REGISTRY_URL);


        await registerSchemaIfNotExists(new ProductCreatedSearchProducer().valueSubject, ["kafka", "schemas", "product-created-search.event.schema.json"],1);
        await registerSchemaIfNotExists(new ProductCreatedProducer().valueSubject, ["kafka", "schemas", "product-created.event.schema.json"],1);

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





async function setupDB(){
    await initializeAppDataSource();


    shutdown.register(async () => {
        console.log('Closing db connection ...');
        AppDataSource.destroy()
    });

}

async function setupHttpServer(){

    const server = startHttpServer();

    shutdown.register(async () => {
        console.log('Closing http server ...');
        server.close();
    });

}






async function setupKafka(){

    

    await kafkaClientWrapper.initiate({
        clientId: "product-service",
        brokers: [config.KAFKA_URL],
        retry: {
            retries:7
        }
    });
    

    consumerWrapper.initiate(kafkaClientWrapper.kafka,{groupId:"product-consumer-group-id"});

    await consumerWrapper.consumer.connect();

    producerWrapper.initiate(kafkaClientWrapper.kafka,{});
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


    const sellerProfileCreatedConsumer = new SellerProfileCreatedConsumer();
    await sellerProfileCreatedConsumer.subscribe(true);

    
    const sellerProfileUpdatedConsumer = new SellerProfileUpdatedConsumer();
    await sellerProfileUpdatedConsumer.subscribe(true);


    consumerWrapper.consumeManagers = [sellerProfileCreatedConsumer,sellerProfileUpdatedConsumer];

    await consumerWrapper.run();


    startDispatchingEvents()
}

main()

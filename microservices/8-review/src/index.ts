import { startHttpServer } from "./server/server"
import { ShutdownManager } from "./shutdownManager";
import { consumerWrapper, kafkaClientWrapper, loggerWrapper, producerWrapper, registryWrapper } from "@faeasyshop/common";
import { initializeAppDataSource } from "./orm/initialize";
import { AppDataSource } from "./orm/data-source";
import { OrderCreatedConsumer } from "./kafka/consumers/order-created.consumer";
import { SchemaType } from "@kafkajs/confluent-schema-registry";
import fs from 'fs';
import path from 'path';
import { ReviewCreatedProducer } from "./kafka/producers/review-created.producer";
import { config } from "./config";
import { elasticClient } from "./clients/elasticsearch.client";

const shutdown = new ShutdownManager();



async function main() {

    await loggerWrapper.initiate(elasticClient, { service: "review" })


    await setupDB();

    await setupHttpServer();



    await setupKafka();

    await setupSchemaRegistry()


    
    


}




async function setupSchemaRegistry() {




    try {

        await registryWrapper.initiate(config.SCHEMA_REGISTRY_URL);


        await registerSchemaIfNotExists(new ReviewCreatedProducer().valueSubject, ["kafka", "schemas", "review-created.event.schema.json"],1);

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
        clientId: "order-service",
        brokers: [config.KAFKA_URL],
        retry: {retries:8 }
    });
    

    consumerWrapper.initiate(kafkaClientWrapper.kafka,{groupId:"order-consumer-group-id"});

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


    const orderCreatedConsumer = new OrderCreatedConsumer();
    await orderCreatedConsumer.subscribe(true);




    consumerWrapper.consumeManagers = [orderCreatedConsumer];

    await consumerWrapper.run();


    
}

main()

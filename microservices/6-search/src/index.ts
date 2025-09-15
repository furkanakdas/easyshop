import { elasticClient } from "./clients/elasticsearch.client";
import { config } from "./config";
import { checkElasticHealth } from "./elasticsearch/check-elastic-health";
import { createIndex } from "./elasticsearch/create-index";
import { deleteIndex } from "./elasticsearch/delete-index";
import { productIndexName, productMapping } from "./elasticsearch/indexes/products";
import { reviewIndexName, reviewMapping } from "./elasticsearch/indexes/reviews";
import { startHttpServer } from "./http-server/server"
import { ProductCreatedSearchConsumer } from "./kafka/consumers/product-created-search.consumer";
import { ReviewCreatedConsumer } from "./kafka/consumers/review-created.consumer";
import { ShutdownManager } from "./shutdownManager";
import { consumerWrapper, kafkaClientWrapper, loggerWrapper, producerWrapper, registryWrapper } from "@faeasyshop/common";




const shutdown = new ShutdownManager();



async function main() {

    await loggerWrapper.initiate(elasticClient, { service: "search" })



    await setupElasticSearch();
    await setupHttpServer();

    await setupKafka();
    await setupSchemaRegistry()

}

async function setupElasticSearch() {

    await checkElasticHealth();


    await createIndex({
        index: productIndexName,
        mappings: productMapping
    });


    await createIndex({
        index: reviewIndexName,
        mappings: reviewMapping
    });






    shutdown.register(async () => {
        console.log('Closing elastic search connection ...');
        elasticClient.close()
    });



}


async function setupHttpServer() {

    const server = startHttpServer();

    shutdown.register(async () => {
        console.log('Closing http server ...');
        server.close();
    });

}


async function setupSchemaRegistry() {



    try {
        await registryWrapper.initiate(config.SCHEMA_REGISTRY_URL);

    } catch (error) {
        loggerWrapper.error(error)
    }

}



async function setupKafka() {

    await kafkaClientWrapper.initiate({
        clientId: "search-service",
        brokers: [config.KAFKA_URL],
        retry: {
            retries: 7
        }
    });

    
    consumerWrapper.initiate(kafkaClientWrapper.kafka, { groupId: "search-consumer-group-id" });

    await consumerWrapper.consumer.connect();

    producerWrapper.initiate(kafkaClientWrapper.kafka,{});
    await producerWrapper.producer.connect();

    shutdown.register(async () => {

        console.log('Stopping Kafka consumer...');
        await consumerWrapper.consumer.stop();

        console.log('Disconnecting Kafka consumer...');
        await consumerWrapper.consumer.disconnect();
    });


    const productCreatedSearchConsumer = new ProductCreatedSearchConsumer();
    await productCreatedSearchConsumer.subscribe(true);

    const reviewCreatedConsumer = new ReviewCreatedConsumer();
    await reviewCreatedConsumer.subscribe(true);

    consumerWrapper.consumeManagers = [productCreatedSearchConsumer,reviewCreatedConsumer];

    await consumerWrapper.run();


}

main()



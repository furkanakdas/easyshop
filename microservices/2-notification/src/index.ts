import { startHttpServer } from "./http-server/server"
import "./config"
import { config } from "./config";
import { consumerWrapper, kafkaClientWrapper, loggerWrapper, producerWrapper, registryWrapper } from "@faeasyshop/common";
import { VerifyEmailConsumer } from "./kafka/consumers/verify-email.consumer";
import { ShutdownManager } from "./shutdownManager";
import { ForgotPasswordConsumer } from "./kafka/consumers/forgot-password.consumer";
import { elasticClient } from "./http-server/clients/elasticsearch.client";



const shutdown = new ShutdownManager();


async function main() {

    await loggerWrapper.initiate(elasticClient, { service: "notification" })

    await setupHttpServer();



    await setupKafka();
    await setupSchemaRegistry();

}

async function setupHttpServer(){

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







async function setupKafka(){

    await kafkaClientWrapper.initiate({

        clientId: "notification-service",
        brokers: [config.KAFKA_URL],
        retry: {
            restartOnFailure(e: Error): Promise<boolean> {
                                
                return new Promise<boolean>((resolve, reject) => {
                    
                    resolve(true)
                });
            },
            retries:7
            
        }
    });

    producerWrapper.initiate(kafkaClientWrapper.kafka,{});
    consumerWrapper.initiate(kafkaClientWrapper.kafka,{groupId:"notification-consumer-group-id"});
    
    
    await producerWrapper.producer.connect();
    await consumerWrapper.consumer.connect();


    shutdown.register(async () => {

        console.log('Stopping Kafka consumer...');
        await consumerWrapper.consumer.stop();

        console.log('Disconnecting Kafka consumer...');
        await consumerWrapper.consumer.disconnect();
    });

    shutdown.register(async () => {
        console.log('Disconnecting Kafka producer...');
        await producerWrapper.producer.disconnect();
    });


    const verifyEmailConsumer = new VerifyEmailConsumer();
    await verifyEmailConsumer.subscribe(true);

    const forgotPasswordConsumer = new ForgotPasswordConsumer();
    await forgotPasswordConsumer.subscribe(true);

    consumerWrapper.consumeManagers = [verifyEmailConsumer,forgotPasswordConsumer];

    await consumerWrapper.run();


}




main()

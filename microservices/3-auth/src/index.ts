
import { startHttpServer } from "./server/server"
import { shutdown, ShutdownManager } from "./shutdownManager";
import { prisma } from "./server/clients/database.client";
import { adminWrapper, consumerWrapper, ElasticHealthChecker, kafkaClientWrapper, kafkaLogCreator,  loggerWrapper, producerWrapper, registryWrapper } from "@faeasyshop/common";
import { UserRoleUpdatedConsumer } from "./kafka/consumers/user-role-updated.consumer";

import { elasticClient } from "./server/clients/elasticsearch.client";
import { logLevel } from "kafkajs";
import { startDispatchingOutboxEvents, stopDispatchingOutboxEvents } from "./server/dispatchers/dispatchOutboxEvents";
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import fs from 'fs';
import path from 'path';
import { UserCreatedProducer } from "./kafka/producers/user-created.producer";
import { UserUpdatedProducer } from "./kafka/producers/user-updated.producer";
import { VerifyEmailProducer } from "./kafka/producers/verify-email.producer";
import { VerifyOtpProducer } from "./kafka/producers/verify-otp.producer";
import { ForgotPasswordProducer } from "./kafka/producers/forgot-password.producer";
import { config } from "./config";






async function main() {


    await loggerWrapper.initiate(elasticClient, { service: "auth" })

    await setupDB();

    await setupHttpServer();
    await setupSchemaRegistry();

    await setupKafka();

}


async function setupSchemaRegistry() {



    try {

        await registryWrapper.initiate(config.SCHEMA_REGISTRY_URL);


        await registerSchemaIfNotExists(new UserCreatedProducer().valueSubject, ["kafka", "schemas", "user-created.event.schema.json"], 1);
        await registerSchemaIfNotExists(new UserUpdatedProducer().valueSubject, ["kafka", "schemas", "user-updated.event.schema.json"], 1);
        await registerSchemaIfNotExists(new VerifyEmailProducer().valueSubject, ["kafka", "schemas", "verify-email.event.schema.json"], 1);
        await registerSchemaIfNotExists(new VerifyOtpProducer().valueSubject, ["kafka", "schemas", "verify-otp.event.schema.json"], 1);
        await registerSchemaIfNotExists(new ForgotPasswordProducer().valueSubject, ["kafka", "schemas", "forgot-password.event.schema.json"], 1);

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
        console.log("s");
        
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




export async function setupKafka() {

    await kafkaClientWrapper.initiate({
        clientId: "auth-service",
        brokers: [config.KAFKA_URL],

        retry: {
            retries: 20,
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



    producerWrapper.initiate(kafkaClientWrapper.kafka, {});
    consumerWrapper.initiate(kafkaClientWrapper.kafka, { groupId: "auth-consumer-group-id1" });



    try {

        await producerWrapper.producer.connect();
        await consumerWrapper.consumer.connect();



        const userRoleUpdatedConsumer = new UserRoleUpdatedConsumer();

        await userRoleUpdatedConsumer.subscribe(true);
        consumerWrapper.consumeManagers = [userRoleUpdatedConsumer];
        await consumerWrapper.consumer.run();

        loggerWrapper.info("Kafka connections set")


    } catch (error) {
        if (error instanceof Error) {
            loggerWrapper.error(error.message, { stack: error.stack })
        }
    }


    shutdown.register(async () => {

        loggerWrapper.info('Stopping Kafka consumer...', { from: "disconnectKafka" });
        await consumerWrapper.consumer.stop();

        loggerWrapper.info('Disconnecting Kafka consumer...', { from: "disconnectKafka" });
        await consumerWrapper.consumer.disconnect();

        loggerWrapper.info('Disconnecting Kafka producer...', { from: "disconnectKafka" });
        await producerWrapper.producer.disconnect();

        loggerWrapper.info('Disconnecting Kafka admin...', { from: "disconnectKafka" });
        await adminWrapper.admin.disconnect();
        loggerWrapper.info('Kafka disconnected');

    });


    startDispatchingOutboxEvents()




}


main()





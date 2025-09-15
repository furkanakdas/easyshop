import { Consumer, ConsumerConfig, ConsumerRunConfig, ConsumerSubscribeTopics, EachBatchPayload, EachMessagePayload, Kafka, KafkaMessage } from "kafkajs";
import { Event } from "../events/event";
import { ConsumerManager } from "./consumer.manager";
import { loggerWrapper } from "../logger/loggerWrapper";
import { registryWrapper } from "./registry.client.wrapper";




export class ConsumerWrapper {


  private _consumer?: Consumer;
  get consumer() {
    if (!this._consumer) {
      throw new Error('Cannot access Kafka consumer client before connecting');
    }
    return this._consumer;
  }

  set consumer(consumer: Consumer) {
    this._consumer = consumer;
  }

  consumeManagers: ConsumerManager<Event>[] = []


  constructor() { }

  initiate(kafka: Kafka, consumerConfig: ConsumerConfig) {

    this.consumer = kafka.consumer(consumerConfig);



    this.consumer.on("consumer.connect", async () => {
      loggerWrapper.info("consumer.connectevent received")

    });
    this.consumer.on("consumer.disconnect", async () => {
      loggerWrapper.info("consumer.disconnect event received")

    });
    this.consumer.on("consumer.crash", async (event) => {
      loggerWrapper.info("consumer.crash event received");
    });
  }

  async subscribe(consumerSubscribeTopic: ConsumerSubscribeTopics) {
    await this.consumer.subscribe(consumerSubscribeTopic)
  }


  async run(consumerRunConfig?: ConsumerRunConfig): Promise<void> {

    if (!this.consumer) {
      throw Error("You have to initiate consumer first")
    }

    if (consumerRunConfig) {
      return await this.consumer.run(consumerRunConfig);
    }

    await this.consumer.run({

      autoCommit: false,
      eachBatch: async (
        {
          batch,
          resolveOffset,
          heartbeat,
          commitOffsetsIfNecessary,
          uncommittedOffsets,
          isRunning,
          isStale }) => {



        const topic = batch.topic;

        for (const message of batch.messages) {


          if (!isRunning() || isStale()) break;

          if (!message.value) {
            throw Error("Kafka message value is null ")
          }

          let decodedValue: any
          try {
            decodedValue = await registryWrapper.decodeMessage(message.value);
            loggerWrapper.info("message value decoded with schema registry");
          } catch (error) {
            if (error instanceof Error) {
              loggerWrapper.error(error.message, { error });

              continue;
            }

          }

          //const decodedValue = JSON.parse(message.value.toString());



          const consumerToProcess = this.consumeManagers.find(consumeManager => consumeManager.topic == topic);
          await consumerToProcess?.processEvent(decodedValue, message);

          resolveOffset(message.offset);

          await heartbeat();

          await consumerWrapper.consumer.commitOffsets([
            {
              topic: batch.topic,
              partition: batch.partition,
              offset: (parseInt(message.offset, 10) + 1).toString(),
            },
          ]);

          let decodedKey: string | undefined;
          if (message.key)
            decodedKey = message.key.toString()
          loggerWrapper.logger.info("event consumed", { topic: batch.topic, value: decodedValue, key: decodedKey })

        }
      },
    })


  };


}

export const consumerWrapper = new ConsumerWrapper();


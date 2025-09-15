import { Kafka, KafkaMessage, Producer, ProducerConfig, ProducerRecord } from "kafkajs";
import { loggerWrapper } from "../logger/loggerWrapper";


export class ProducerWrapper {


  private _producer?: Producer;


  get producer() {
    if (!this._producer) {
      throw new Error('Cannot access Kafka producer client before connecting');
    }
    return this._producer;
  }

  set producer(producer: Producer) {
    this._producer = producer;
  }

  constructor() { }

  initiate(kafka: Kafka, producerConfig: ProducerConfig) {

    this.producer = kafka.producer(producerConfig);


    this.producer.on("producer.connect", () => {
      loggerWrapper.info("producer.connect event received");
    });

    this.producer.on("producer.disconnect", () => {
      loggerWrapper.info("producer.disconnect event received");
    });

    
  }


  async send(record: ProducerRecord) {

    await this.producer.send(record);
  }


}

export const producerWrapper = new ProducerWrapper();


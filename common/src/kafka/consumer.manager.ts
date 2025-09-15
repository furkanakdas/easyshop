import { Consumer, EachBatchPayload, EachMessagePayload, KafkaMessage } from "kafkajs";
import { Event } from "../events/event";
import { consumerWrapper, ConsumerWrapper } from "./consumer.wrapper";


export abstract class ConsumerManager<T extends Event> {


  abstract topic: T['topic'];
  abstract  processEvent(value: T['value'], event: KafkaMessage): Promise<void> ;

  constructor() {
  }

  async subscribe(fromBeginning: boolean) {
    await consumerWrapper.subscribe({ topics: [this.topic], fromBeginning: fromBeginning });
  };




}


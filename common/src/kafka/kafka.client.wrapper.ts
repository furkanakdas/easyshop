import { Producer, ProducerConfig, Kafka, KafkaConfig, Consumer, ConsumerConfig  } from 'kafkajs'





class KafkaClientWrapper {

  private _kafka?: Kafka;




  get kafka()  {
    if (!this._kafka) {
      throw new Error('Cannot access Kafka instance before connecting');
    }
    return this._kafka;
  }

  set kafka(kafka:Kafka){
    this._kafka = kafka;
  }



  constructor(){}

  async initiate(kafkaConfig:KafkaConfig){
    this.kafka = new Kafka(kafkaConfig)
    
  }



}

export const kafkaClientWrapper = new KafkaClientWrapper();
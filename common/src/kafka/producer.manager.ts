import { Event } from "../events/event";
import { loggerWrapper } from "../logger/loggerWrapper";
import { producerWrapper } from "./producer.wrapper";
import { registryWrapper } from "./registry.client.wrapper";


export abstract class ProducerManager<T extends Event> {

    abstract topic: T['topic'];
    abstract valueSubject: T["valueSubject"]


    constructor() {
    }

    async send(value: T['value'], key?: string): Promise<void> {


        try {
            let encodedValue: Buffer<ArrayBuffer>;

            console.log("???????????????");
            console.log(typeof value.price);
            
            


            encodedValue = await registryWrapper.encodeMessage(this.valueSubject, value);
            loggerWrapper.info("message value encoded with schema registry");



            await producerWrapper.send({

                topic: this.topic,
                messages: [
                    { key, value: encodedValue },
                ],
            })

        } catch (error) {

            throw error
        }


    };

}



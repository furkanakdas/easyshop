import { Currency } from "../../enums/currency";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";

export interface ProductCreatedEvent extends Event {

    topic: Topics.PRODUCT_CREATED;
    valueSubject: ValueSubjects.PRODUCT_CREATED;
    value: {
        id: string,
        name: string,
        description: string | null,
        price: number,
        currency: Currency,
        createdAt: Date,
        updatedAt: Date,
        stripePriceId:string,
        stripeProductId:string,
        categoryId:string,
        sellerId:string,
        attributes:
        {
            attributeDefinitionId:string,
            name: string,
            value: string,
            unit:string | null
        }[],
        tagsIds:string[],
        inventory:{
            id:string,
            quantity:number,
        }

    };

}




import { Currency } from "../../enums/currency";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";


export interface ProductCreatedSearchEvent extends Event {

    topic: Topics.PRODUCT_CREATED_SEARCH;
    valueSubject: ValueSubjects.PRODUCT_CREATED_SEARCH;
    value: {
        id: string,
        name: string,
        description: string | null,
        price: number,
        currency: Currency,
        createdAt: Date,
        updatedAt: Date,
        
        category: {
            id:string,
            name: string,
            categoryIdPath: string[],
        },
        seller:{
            id:string
        }
        attributes:
        {
            attributeDefinitionId:string,
            name: string,
            value: string,
            unit:string | null
        }[],
        tagIds:string[]
    };



}




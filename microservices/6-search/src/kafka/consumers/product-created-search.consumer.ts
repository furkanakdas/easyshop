import { ConsumerManager, Currency, ForgotPasswordEvent, ProductCreatedSearchEvent, Topics, UserCreatedEvent, UserRole, VerifyEmailEvent, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { elasticClient } from "../../clients/elasticsearch.client";
import { productIndexName, productMapping } from "../../elasticsearch/indexes/products";


export class ProductCreatedSearchConsumer extends ConsumerManager<ProductCreatedSearchEvent> {



    topic: Topics.PRODUCT_CREATED_SEARCH = Topics.PRODUCT_CREATED_SEARCH;


    async processEvent(
        value: {
            id: string;
            name: string; description: string | null;
            price: number; currency: Currency; createdAt: Date;
            updatedAt: Date; category: { id: string; name: string; categoryIdPath: string[]; };
            seller: { id: string; };
            attributes: { attributeDefinitionId: string; name: string; value: string; unit: string | null; }[];
            tagIds: string[];
        }, event: KafkaMessage): Promise<void> {



        await elasticClient.index({
            index: productIndexName,
            id: value.id,
            document: {
                
                ...value,
                tagIds:value.tagIds,
                createdAt: new Date(value.createdAt).toISOString(),
                updatedAt: new Date(value.updatedAt).toISOString()
            }
        });

        console.log("consumed value:", value);

    }


}





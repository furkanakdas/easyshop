import { ConsumerManager, Currency, ForgotPasswordEvent, ProductCreatedSearchEvent, ReviewCreatedEvent, ReviewRate, ReviewTargetType, Topics, UserCreatedEvent, UserRole, VerifyEmailEvent, registryWrapper } from "@faeasyshop/common";
import { KafkaMessage } from "kafkajs";
import { elasticClient } from "../../clients/elasticsearch.client";
import { ProductDocument, productIndexName, productMapping } from "../../elasticsearch/indexes/products";
import { ReviewDocument, reviewIndexName } from "../../elasticsearch/indexes/reviews";


export class ReviewCreatedConsumer extends ConsumerManager<ReviewCreatedEvent> {




    topic: Topics.REVIEW_CREATED = Topics.REVIEW_CREATED;


    async processEvent(value: {
        id: string; buyerId: string; targetId: string; targetSnapshotId: string; targetType: ReviewTargetType;
        rating: ReviewRate; comment: string | null; createdAt: Date; updatedAt: Date;
    }, event: KafkaMessage): Promise<void> {


        if (value.targetType == ReviewTargetType.ORDER_PRODUCT) {

            const { _source: product } = await elasticClient.get<ProductDocument>({
                index: productIndexName,
                id: value.targetId
            });

            if (!product) {
                throw new Error("Reviewed product does not exist on elasticsearch")
            }
            const oldRating = product.averageRating || 0;
            const oldReviewCount = product.reviewCount || 0;
            let commentCount = product.commentCount || 0;


            const newReviewCount = oldReviewCount + 1;
            
            if (value.comment)
                commentCount += 1

            const newAverage = ((oldRating * oldReviewCount) + value.rating) / newReviewCount;

            await elasticClient.update({
                index: productIndexName,
                id: value.targetId,
                doc: {
                    reviewCount: newReviewCount,
                    commentCount: commentCount,
                    averageRating: newAverage,
                }
            })
        }
        else if(value.targetType == ReviewTargetType.SELLER){
            
        }


        await elasticClient.index({
            index: reviewIndexName,
            id: value.id,
            document: {
                ...value,
                createdAt: new Date(value.createdAt).toISOString(),
                updatedAt: new Date(value.updatedAt).toISOString()
            }
        });


        console.log("consumed value:", value);
    }


}





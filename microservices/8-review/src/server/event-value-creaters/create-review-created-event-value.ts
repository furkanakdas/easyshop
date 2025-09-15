import { ProductCreatedEvent, ProductCreatedSearchEvent, ReviewCreatedEvent } from "@faeasyshop/common";
import { Review } from "../../orm/entity/review";


export async function createReviewCreatedEventValue(review: Review) {

    return {
        id: review.id,
        buyerId: review.buyerId,
        targetId: review.targetId,
        targetType: review.targetType,
        targetSnapshotId:review.targetSnapshotId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
    } satisfies ReviewCreatedEvent["value"]
}

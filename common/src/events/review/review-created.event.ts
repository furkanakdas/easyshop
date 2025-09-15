import { Currency } from "../../enums/currency";
import { ReviewRate } from "../../enums/review-rate.enum";
import { ReviewTargetType } from "../../enums/review-target.enum";
import { Topics } from "../../enums/topics";
import { ValueSubjects } from "../../enums/value-subjects";


export interface ReviewCreatedEvent extends Event {

    topic: Topics.REVIEW_CREATED;
    valueSubject: ValueSubjects.REVIEW_CREATED;
    value: {
        id: string,
        buyerId: string,
        targetId: string,
        targetType: ReviewTargetType,
        targetSnapshotId:string,
        rating: ReviewRate,
        comment:string | null,
        createdAt:Date,
        updatedAt:Date
    };
}

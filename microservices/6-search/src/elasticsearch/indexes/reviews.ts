import { MappingTypeMapping } from "@elastic/elasticsearch/lib/api/types";







export const reviewIndexName = "reviews";

export const reviewMapping = {
    properties: {
        id: { type: 'keyword' },
        buyerId: { type: 'keyword' },
        targetId: { type: 'keyword' },
        targetSnapshotId: { type:'keyword' },
        targetType: { type: 'keyword' },
        rating: { type: 'integer' },
        comment: { type: 'text' },
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
    }
} satisfies MappingTypeMapping



export interface ReviewDocument {
    id: string;
    buyerId: string;
    targetId: string;
    targetSnapshotId:string,
    targetType: string; 
    rating: number;
    comment: string;
    createdAt: string; 
    updatedAt: string;
}
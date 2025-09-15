import { MappingTypeMapping } from "@elastic/elasticsearch/lib/api/types";







export const sellerProfileIndexName = "products";

export const sellerProfileMapping = {
    properties: {
        id: { type: 'keyword' },
        name: {
            type: 'text',
            fields: {
                keyword: { type: 'keyword', ignore_above: 256 }
            }
        },
        description: { type: 'text' },
        price: { type: 'float' },
        currency: { type: 'keyword' },
        createdAt: { type: 'date' },
    

        reviewCount: { type: 'integer' },
        commentCount: { type: 'integer' },
        averageRating: { type: "float" }

    }
} satisfies MappingTypeMapping




export interface ProductDocument {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  createdAt: string; // Elasticsearch tarihleri ISO string döner

  seller: {
    id: string;
  };


  reviewCount: number;
  commentCount: number;
  averageRating: number;
}

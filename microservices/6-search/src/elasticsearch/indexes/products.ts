import { MappingTypeMapping } from "@elastic/elasticsearch/lib/api/types";







export const productIndexName = "products";

export const productMapping = {
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
        category: {
            properties: {
                id: { type: 'keyword' },
                name: { type: 'text' },
                categoryIdPath: { type: 'text' }
            }
        },
        seller: {
            properties: {
                id: { type: 'keyword' }
            }
        },
        attributes: {
            type: 'nested',
            properties: {
                attributeDefinitionId: { type: "keyword" },
                name: { type: 'keyword' },
                value: { type: 'keyword' },
                unit: { type: "keyword" }
            }
        },
        tagIds: { type: 'keyword' },

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

  category: {
    id: string;
    name: string;
    categoryIdPath: string;
  };

  seller: {
    id: string;
  };

  attributes: Array<{
    attributeDefinitionId: string;
    name: string;
    value: string;
    unit: string;
  }>;

  tagIds: string[];

  reviewCount: number;
  commentCount: number;
  averageRating: number;
}

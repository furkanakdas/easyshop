import { Request, Response } from "express";

import { StatusCodes } from 'http-status-codes';
import { searchProductRequestSchema } from "../schema/search-product.schema";
import { elasticClient } from "../../clients/elasticsearch.client";
import { loggerWrapper } from "@faeasyshop/common";

export async function searchProductController(req: Request, res: Response) {

    const request = searchProductRequestSchema.parse(req);
    const query = request.query;

    let {
        q,
        categoryId,
        sellerId,
        minPrice,
        maxPrice,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20,
        tagIds,
        ...rest
    } = query;

    console.log(query);
    




    

    const arrayTagIds = tagIds?.split(',').filter(Boolean) || [];


    const must = [];
    const filter = [];

    if (q) {
        must.push({
            multi_match: {
                query: q,
                fields: ['name', 'description'],
            }
        });
    }


    if (categoryId) filter.push({ match: { 'category.categoryIdPath': categoryId } });
    if (sellerId) filter.push({ term: { 'seller.id': sellerId } });



    if (minPrice || maxPrice) {
        const priceRange: any = {};
        if (minPrice) priceRange.gte = minPrice;
        if (maxPrice) priceRange.lte = maxPrice;
        filter.push({ range: { price: priceRange } });
    }


    if (arrayTagIds.length > 0) {



        const tagsQuery = arrayTagIds.map(tagId => ({
            nested: {
                path: "tagIds",
                query: {
                    bool: {
                        must: [
                            { term: { "tagIds": tagId } }
                        ]
                    }
                }
            }
        }))

        filter.push(...tagsQuery)

    }



    // Nested attribute filters
    for (const [key, value] of Object.entries(rest)) {
        
        if (key.startsWith("attribute.")) {

            const attributeDefinitionId = key.split('.')[1];

            filter.push({
                nested: {
                    path: 'attributes',
                    query: {
                        bool: {
                            must: [
                                { term: { 'attributes.attributeDefinitionId': attributeDefinitionId } },
                                { term: { 'attributes.value': value } }
                            ]
                        }
                    }
                }
            });
        }
    }


    

    const esQuery = {
        index: 'products',
        from: (page - 1) * limit,
        size: limit,
        body: {
            query: {
                bool: {
                    must,
                    filter
                }
            },
            sort: [{ [sortBy]: { order: sortOrder } }]
        }
    };

    
    

    // Elasticsearch client ile istek atılır
    const response = await elasticClient.search(esQuery);
    const results = response.hits.hits.map(hit => hit._source);

    loggerWrapper.info("query body:",esQuery.body)

    res.status(StatusCodes.OK).json({ results})
}









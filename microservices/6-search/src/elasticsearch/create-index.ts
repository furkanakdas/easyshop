import { IndicesCreateRequest } from "@elastic/elasticsearch/lib/api/types";
import { elasticClient } from "../clients/elasticsearch.client";






export async function createIndex(indicesCreateRequest:IndicesCreateRequest){


    const exists = await elasticClient.indices.exists({ index: indicesCreateRequest.index });


    if (!exists) {
            await elasticClient.indices.create(indicesCreateRequest);

            console.log('✅ Product index created with mapping.');
        } else {
            console.log('ℹ️ Product index already exists.');
        }



       

}



import { IndicesCreateRequest, IndicesDeleteRequest } from "@elastic/elasticsearch/lib/api/types";
import { elasticClient } from "../clients/elasticsearch.client";






export async function deleteIndex(indicesDeleteRequest:IndicesDeleteRequest){


    const exists = await elasticClient.indices.exists({ index: indicesDeleteRequest.index });


    if (exists) {
            await elasticClient.indices.delete(indicesDeleteRequest);

            console.log(' Product index deleted');
        } else {
            console.log('ℹProduct index does not exist.');
        }


}
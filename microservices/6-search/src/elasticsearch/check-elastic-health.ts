import { elasticClient } from "../clients/elasticsearch.client";


export let elasticConnected=false;

export async function checkElasticHealth(retries = 20, delay = 10000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await elasticClient.ping();
      elasticConnected = true;
      console.log(' Elasticsearch is reachable.');
      return;
    } catch (err) {
      elasticConnected = false;
      console.error(` Attempt ${attempt}: Elasticsearch is unreachable.`);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw new Error(' Failed to connect to Elasticsearch after multiple attempts.');
      }
    }
  }
}

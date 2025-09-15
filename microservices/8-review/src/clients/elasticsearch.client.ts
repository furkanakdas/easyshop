import { Client } from '@elastic/elasticsearch';
import { config } from '../config';

export const elasticClient = new Client({
  node: config.ELASTIC_SEARCH_URL, 
  auth: {
    username: config.ELASTIC_USERNAME,
    password: config.ELASTIC_PASSWORD,
  },
  maxRetries: 15,
  requestTimeout: 10000,
  sniffOnStart: false,
});


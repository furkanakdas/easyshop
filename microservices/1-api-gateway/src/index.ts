import { config } from "./config";
import { elasticClient } from "./server/clients/elasticsearch.client";
import { RedisConnection } from "./server/redis/redis-connection";
import { startHttpServer } from "./server/server";
import { ShutdownManager } from "./shutdownManager";
import { loggerWrapper, NodeEnv } from "@faeasyshop/common";



const shutdown = new ShutdownManager();


async function main() {


    await loggerWrapper.initiate(elasticClient, { service: "api-gateway" })
    

    const redisConnection = RedisConnection.getInstance(config.REDIS_CONNECTION_URL);

    redisConnection.connect().catch(error => {
        loggerWrapper.error('Redis connection error:', error)
    });




    setupServer();

}

function setupServer() {




    const server = startHttpServer();

    shutdown.register(async () => {
        console.log('Closing http server ...');
        server.close();
    });




}


main()

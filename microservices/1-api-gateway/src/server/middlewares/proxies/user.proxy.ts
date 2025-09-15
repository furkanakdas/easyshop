import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../../../config';
import { RedisCache } from '../../redis/redis-cache';
import { NextFunction, Request, Response } from "express";
import { RedisConnection } from '../../redis/redis-connection';
import { loggerWrapper } from '@faeasyshop/common';





export function userProxyMiddleware(req: Request, res: Response, next: NextFunction) {
    const redisConnection = RedisConnection.getInstance();
    const redisCache = new RedisCache(redisConnection);
    const cacheInfo = req.cacheInfo;

    const userCachingProxy = createProxyMiddleware({
        target: config.USER_BASE_URL,
        changeOrigin: true,
        selfHandleResponse: Boolean(cacheInfo),

        on: {
            proxyRes: (proxyRes, req, res) => {
                if (!cacheInfo) return;

                const cacheKey = cacheInfo.cacheKey;
                const cacheTtlSeconds = cacheInfo.ttlSeconds;

                

                let responseBody = Buffer.from('');

                proxyRes.on('data', (chunk) => {
                    responseBody = Buffer.concat([responseBody, chunk]);
                });

                proxyRes.on('end', async () => {
                    const bodyString = responseBody.toString('utf8');

                    if (Buffer.byteLength(bodyString) < 1024 * 1024) {
                        try {
                            await redisCache.set(cacheKey, bodyString, cacheTtlSeconds);
                            loggerWrapper.info('Cache SET:', { cacheKey, bodyString })
                        } catch (err) {
                            loggerWrapper.error('Redis SET error:', { cacheKey, bodyString });
                        }
                    }

                    res.statusCode = proxyRes.statusCode || 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(bodyString);
                });
            },
        },
    });

    userCachingProxy(req, res, next);
}
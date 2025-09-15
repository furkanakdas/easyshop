import { NextFunction, Request, Response } from "express";
import { RedisConnection } from "../redis/redis-connection";
import { RedisCache } from "../redis/redis-cache";
import { StatusCodes } from "http-status-codes";
import { loggerWrapper } from "@faeasyshop/common";


declare global {
  namespace Express {
    interface Request {
      cacheInfo?:{
        cacheKey: string;
        ttlSeconds:number
      }
    }
  }
}


export const cacheMiddleware = (keyPrefix: string, includeUserIdInKey: boolean, ttlSeconds: number = 30000,) => {
  return async (req: Request, res: Response, next: NextFunction) => {

    if (req.method != 'GET' || req.query.cache == 'false') {
      next();
      return
    }



    const redisConnection = RedisConnection.getInstance();
    const redisCache = new RedisCache(redisConnection);

    if (!redisConnection.isConnected) {
      loggerWrapper.error("Redid connection is down.So request proxing to services");
      next();
      return
    }

    const userId = includeUserIdInKey ? (req.clientJwtPayload?.id ?? 'anon') : undefined;
    const cacheKey = redisCache.buildCacheKey(keyPrefix, req, userId);
    req.cacheInfo = {cacheKey,ttlSeconds};

    loggerWrapper.info(`cacheKey created`,{cacheKey});
    try {
      const cachedData = await redisCache.get(cacheKey);
      if (cachedData) {
        loggerWrapper.info("Cache HIT",{cacheKey,cachedData})
        res.status(StatusCodes.OK).json(JSON.parse(cachedData));
        return
      } else {
        loggerWrapper.warn(`Cached Data not found`,{cacheKey});
      }

      next();
      return;
    } catch (error) {
      loggerWrapper.error(error);

      next();
      return;
    }
  };
};











import { RedisConnection } from './redis-connection';
import { RedisClientType } from 'redis';
import { Request } from 'express';
import qs from 'qs';
import { loggerWrapper } from '@faeasyshop/common';

export class RedisCache {
  private client: RedisClientType;

  constructor(redisConnection: RedisConnection) {
    this.client = redisConnection.getClient();
  }




  buildCacheKey(prefix: string, req: Request,userId :string | undefined): string {
    const path = req.path;
    const sortedQuery = qs.stringify(req.query, { sort: (a, b) => a.localeCompare(b) });

    if(userId){
      return `${prefix}:${userId}:${path}?${sortedQuery}`;
    }else{
      return `${prefix}:${path}?${sortedQuery}`;
    }


  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      loggerWrapper.error('RedisCache get error:', {error:error})
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (ttlSeconds) {
        await this.client.setEx(key, ttlSeconds, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      loggerWrapper.error('RedisCache set error:', {error:error})
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result == 1;
    } catch (error) {
      console.error('RedisCache del error:', error);
      return false;
    }
  }
}

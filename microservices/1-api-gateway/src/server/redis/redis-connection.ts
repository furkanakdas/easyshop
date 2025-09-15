import { createClient, RedisClientType } from 'redis';
import { config } from '../../config';
import { loggerWrapper } from '@faeasyshop/common';

export class RedisConnection {
  private static instance: RedisConnection;
  private client: RedisClientType;
  public isConnected: boolean = false;



  private constructor(redisUrl: string) {

    this.client = createClient({
      url: redisUrl,  
      socket: {
        reconnectStrategy: retries => {
          if (retries > 10) {
            return new Error('Retry limit reached');
          }
          return 6000;  
        }
      }
    });

    this.client.on('connect', () => {
      loggerWrapper.info('Redis connecting...')
      console.log('Redis connecting...');
    });

    this.client.on('ready', () => {
      loggerWrapper.info('Redis connected and ready')

      this.isConnected = true;
    });

    this.client.on('end', () => {
      loggerWrapper.error('Redis connection closed')

      this.isConnected = false;
    });

    this.client.on('error', err => {
      loggerWrapper.error(err)

      this.isConnected = false;
    });
  }

  public static getInstance(redisUrl = config.REDIS_CONNECTION_URL): RedisConnection {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection(redisUrl);
    }
    return RedisConnection.instance;
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async disconnect() {
    if (this.client.isOpen) {
      await this.client.destroy();
    }
  }
}

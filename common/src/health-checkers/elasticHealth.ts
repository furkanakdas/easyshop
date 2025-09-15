import { Client } from '@elastic/elasticsearch';

export class ElasticHealthChecker {
  private client: Client;
  private isConnected = false;
  private onConnect?: (status: string) => void;
  private onError?: (error: any) => void;

  constructor(
    client: Client,
    options?: {
      onConnect?: (status: string) => void;
      onError?: (error: any) => void;
    }) {

    this.client = client;
    this.onConnect = options?.onConnect,
      this.onError = options?.onError
  }

  public start() {
    this.checkConnection();
    setInterval(() => this.checkConnection(), 10000);
  }

  private async checkConnection() {
    try {
      const health = await this.client.cluster.health();
      this.handleConnect(health.status)
    } catch (error) {
      this.handleError(error)
    }
  }

  private handleConnect(healthStatus:string) {
    if (!this.isConnected) {
      this.isConnected = true;
      this.onConnect?.(healthStatus);
    }
  }

  private handleError(error: any) {
    if (this.isConnected) {
      this.isConnected = false;
      this.onError?.(error);
    }
  }


  getClient() {
    return this.client;
  }

  getStatus() {
    return this.isConnected;
  }
}





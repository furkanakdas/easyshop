import { Admin } from "kafkajs";
import { loggerWrapper } from "../logger/loggerWrapper";


export class KafkaHealthChecker {
  private admin: Admin;
  private isConnected: boolean | undefined = undefined;
  private onConnect?: () => void;
  private onError?: (error: any) => void;



  constructor(
    admin: Admin,
    options?: {
      onConnect?: () => void;
      onError?: (error: any) => void;
    }) {

    this.admin = admin;
    this.onConnect = options?.onConnect,
      this.onError = options?.onError
  }

  public async start() {

    this.checkConnection();
    setInterval(() => this.checkConnection(), 15000);

  }

  private async checkConnection() {
    try {
      await this.admin.connect()
      await this.admin.describeCluster();
      this.setToConnected();
    } catch (error) {
      await this.admin.disconnect();
      this.setToUnconnected(error);
    }
  }


  public setToConnected() {
    if (this.isConnected == undefined || !this.isConnected) {
      this.isConnected = true;
      loggerWrapper.logger.info("")
      this.onConnect?.();
    }
  }

  public setToUnconnected(error: any) {
    if (this.isConnected == undefined || this.isConnected) {
      this.isConnected = false;
      this.onError?.(error);
    }
  }



  getStatus() {
    return this.isConnected;
  }
}


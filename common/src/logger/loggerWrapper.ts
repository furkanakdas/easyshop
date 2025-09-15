import { createLogger, Logger } from "winston";
import { generateLogger } from "./create-winston-logger";
import { Client } from "@elastic/elasticsearch";




export class LoggerWrapper {
    private _logger?: Logger;

    get logger(): Logger {
        if (!this._logger) throw new Error('Logger not initialized');
        return this._logger;
    }

    set logger(logger: Logger) {
        this._logger = logger;
    }

    constructor() {}

    async initiate(elasticClient: Client, defaultMeta: { service: string }) {
        this.logger = generateLogger(elasticClient, defaultMeta);
    }

    info(message: string, ...meta: any[]): void;
    info(message: any): void;
    info(infoObject: object): void;
    info(messageOrObject: any, ...meta: any[]): void {
        if (typeof messageOrObject === 'string') {
            this.logger.info(messageOrObject, ...meta);
        } else {
            this.logger.info(messageOrObject);
        }
    }

    error(message: string, ...meta: any[]): void;
    error(message: any): void;
    error(infoObject: object): void;
    error(messageOrObject: any, ...meta: any[]): void {
        if (typeof messageOrObject === 'string') {
            this.logger.error(messageOrObject, ...meta);
        } else {
            this.logger.error(messageOrObject);
        }
    }

    warn(message: string, ...meta: any[]): void;
    warn(message: any): void;
    warn(infoObject: object): void;
    warn(messageOrObject: any, ...meta: any[]): void {
        if (typeof messageOrObject === 'string') {
            this.logger.warn(messageOrObject, ...meta);
        } else {
            this.logger.warn(messageOrObject);
        }
    }
}



export const loggerWrapper = new LoggerWrapper();
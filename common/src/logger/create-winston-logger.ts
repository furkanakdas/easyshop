import { createLogger, format, transports } from 'winston';
import { Client } from '@elastic/elasticsearch';
import Transport from 'winston-transport';
import winston from 'winston';
import {ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData} from 'winston-elasticsearch';
// export function generateLogger(elasticClient: Client, defaultMeta: { service: string }) {

//   const logger = createLogger({
//     // exitOnError: false,
//     defaultMeta,
//     level: 'info',
//     format: format.combine(
//       format.timestamp(),
//       format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
//       format.errors({ stack: true })
//     ),
//     transports: [
//       new transports.Console({
//         format: format.combine(
//           format.colorize({ all: true }),
//           format.printf(({ timestamp, level, message, metadata, stack }) => {
//             let meta = metadata && Object.keys(metadata).length > 0
//               ? `\n${JSON.stringify(metadata, null, 2)}`
//               : '';
//             let errorStack = stack ? `\n${stack}` : '';
//             return `[${timestamp}] ${level}: ${message}${meta}${errorStack}`;
//           })
//         ),
//       }),
//       new ElasticTransport({
//         client: elasticClient,
//         index: 'logs',
//       })
//     ],
//   });

//   return logger;

// }




// interface ElasticTransportOptions extends Transport.TransportStreamOptions {
//   client: Client;
//   index: string;
// }

// export class ElasticTransport extends Transport {
//   private client: Client;
//   private index: string;

//   constructor(opts: ElasticTransportOptions) {
//     super(opts);
//     this.client = opts.client;
//     this.index = opts.index;
//   }

//   async log(info: any, callback: () => void) {
//     setImmediate(() => this.emit('logged', info));

//     try {
//       await this.client.index({
//         index: this.index,
//         document: {
//           timestamp: new Date().toISOString(),
//           level: info.level,
//           message: info.message,
//           metadata: info.metadata || {},
//         },
//       });
//     } catch (err) {
//       console.error('[Elastic] Log gönderimi başarisiz:');
//     }

//     callback();

//   }
// }


interface LoggerMeta {
  service: string;
}


export function generateLogger(elasticClient: Client, defaultMeta: LoggerMeta) {
  const esTransportOpts = {
    level: 'info',
    client: elasticClient,
    indexPrefix: 'logs',
    transformer: (logData: any) => {
      const metadata = logData.meta?.metadata || {};
      return {
        '@timestamp': new Date().toISOString(),
        severity: logData.level,
        message: logData.message,
        fields: {
          ...metadata,
          service: defaultMeta.service
        }
      };
    }
  };

  const esTransport = new ElasticsearchTransport(esTransportOpts);

  esTransport.on('error', (err) => {
    console.error('[Winston Elasticsearch Transport Error]', err.message || err);
  });

  const logger = winston.createLogger({
    level: 'info',
    defaultMeta,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'defaultMeta'] }),
      winston.format.errors({ stack: true })
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
            let meta = metadata && Object.keys(metadata).length > 0
              ? `\n${JSON.stringify(metadata, null, 2)}`
              : '';
            let errorStack = stack ? `\n${stack}` : '';
            return `[${timestamp}] ${level}: ${message}${meta}${errorStack}`;
          })
        )
      }),
      esTransport // hata durumunda bile sistem çalışmaya devam eder
    ]
  });

  return logger;
}


// export function generateLogger(elasticClient: Client, defaultMeta: LoggerMeta) {
//   const esTransportOpts = {
//     level: 'info',
//     client: elasticClient,
//     indexPrefix: 'logs', 
//     transformer: (logData: any) => {
//       const metadata = logData.meta?.metadata || {};
//       return {
//         '@timestamp': new Date().toISOString(),
//         severity: logData.level,
//         message: logData.message,
//         fields: {
//           ...metadata,
//           service: defaultMeta.service
//         }
//       };
//     }
//   };

//   const logger = winston.createLogger({
//     level: 'info',
//     defaultMeta,
//     format: winston.format.combine(
//       winston.format.timestamp(),
//       winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp','defaultMeta'] }),
//       winston.format.errors({ stack: true })
//     ),
//     transports: [
//       new winston.transports.Console({
//         format: winston.format.combine(
//           winston.format.colorize({ all: true }),
//           winston.format.printf(({ timestamp, level, message, metadata, stack }) => {
//             let meta = metadata && Object.keys(metadata).length > 0
//               ? `\n${JSON.stringify(metadata, null, 2)}`
//               : '';
//             let errorStack = stack ? `\n${stack}` : '';
//             return `[${timestamp}] ${level}: ${message}${meta}${errorStack}`;
//           })
//         )
//       }),
//       new ElasticsearchTransport(esTransportOpts)
//     ]
//   });

//   return logger;
// }
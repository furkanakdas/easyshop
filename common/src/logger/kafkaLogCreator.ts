import { logCreator, LogEntry, logLevel } from "kafkajs";
import { Logger } from "winston";

export function kafkaLogCreator(logger: Logger): logCreator {
  return () => {
    return ({ namespace, level, log }: LogEntry) => {
      const { message, ...extra } = log;
      const msg = `[${namespace}] ${message}`;

      switch (level) {
        case logLevel.ERROR:
          logger.error(msg, extra);
          break;
        case logLevel.WARN:
          logger.warn(msg, extra);
          break;
        case logLevel.INFO:
          logger.info(msg, extra);
          break;
        case logLevel.DEBUG:
          // Bazı loggerlarda .debug olmayabilir
          if (typeof logger.debug === 'function') {
            logger.debug(msg, extra);
          } else {
            logger.info(msg, extra);
          }
          break;
        default:
          logger.info(msg, extra);
      }
    };
  };
}


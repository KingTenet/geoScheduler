import winston from "winston";

import type { ConfigurationManager } from "./ConfigurationManager";

type SupportedMeta = object;
type SupportedError = unknown;

export class Logger {
    private logger: winston.Logger;

    constructor(private config: ConfigurationManager) {
        this.logger = winston.createLogger({
            level: this.config.getLogLevel(),
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                    ),
                }),
                new winston.transports.File({
                    filename: this.config.getErrorLogPath(),
                    level: "error",
                }),
                new winston.transports.File({
                    filename: this.config.getCombinedLogPath(),
                }),
            ],
        });
    }

    info(message: string, meta?: SupportedMeta): void {
        this.logger.info(message, meta);
    }

    error(message: string, error?: SupportedError): void {
        this.logger.error(message, {
            error: error instanceof Error ? error.stack : error,
        });
    }

    warn(message: string, meta?: SupportedMeta): void {
        this.logger.warn(message, meta);
    }

    debug(message: string, meta?: SupportedMeta): void {
        this.logger.debug(message, meta);
    }
}

import { ILogger, LogLevel, LogLevelEnum } from "../../domain/logger";

export class Logger implements ILogger {
    private logLevel: LogLevel;
    constructor() {
        this.logLevel = LogLevelEnum.DEBUG;
    }

    debug(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.DEBUG) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    info(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.INFO) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    warning(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.WARN) {
            console.info(`[WARN] ${message}`, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.ERROR) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }

    log(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.LOG) {
            console.log(`[LOG] ${message}`, ...args);
        }
    }
}

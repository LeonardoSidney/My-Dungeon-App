import { ILogger, LogLevel, LogLevelEnum } from '@domain/logger';

export class Logger implements ILogger {
    private logLevel: LogLevel;
    constructor() {
        this.logLevel = LogLevelEnum.DEBUG;
    }

    private serializeArgs(args: unknown[]): unknown[] {
        return args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg);
                } catch {
                    return String(arg);
                }
            }
            return arg;
        });
    }

    debug(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.DEBUG) {
            console.debug(`[DEBUG] ${message}`, ...this.serializeArgs(args));
        }
    }

    info(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.INFO) {
            console.info(`[INFO] ${message}`, ...this.serializeArgs(args));
        }
    }

    warning(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.WARN) {
            console.info(`[WARN] ${message}`, ...this.serializeArgs(args));
        }
    }

    error(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.ERROR) {
            console.error(`[ERROR] ${message}`, ...this.serializeArgs(args));
        }
    }

    log(message: string, ...args: unknown[]): void {
        if (this.logLevel <= LogLevelEnum.LOG) {
            console.log(`[LOG] ${message}`, ...this.serializeArgs(args));
        }
    }
}

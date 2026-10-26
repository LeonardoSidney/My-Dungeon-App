import { ILogger, LOG_LEVEL_SEVERITY, LogLevel, LogLevelEnum } from '@domain/logger';

export class Logger implements ILogger {
    private logLevel: LogLevel;
    constructor (logLevel: LogLevel = LogLevelEnum.DEBUG) {
        this.logLevel = logLevel;
    }

    private isEnabled (level: LogLevel): boolean {
        return LOG_LEVEL_SEVERITY[level] >= LOG_LEVEL_SEVERITY[this.logLevel];
    }

    private serializeArgs (args: unknown[]): unknown[] {
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

    debug (message: string, ...args: unknown[]): void {
        if (this.isEnabled(LogLevelEnum.DEBUG)) {
            console.info(`[DEBUG] ${message}`, ...this.serializeArgs(args));
        }
    }

    info (message: string, ...args: unknown[]): void {
        if (this.isEnabled(LogLevelEnum.INFO)) {
            console.info(`[INFO] ${message}`, ...this.serializeArgs(args));
        }
    }

    warning (message: string, ...args: unknown[]): void {
        if (this.isEnabled(LogLevelEnum.WARN)) {
            console.info(`[WARN] ${message}`, ...this.serializeArgs(args));
        }
    }

    error (message: string, ...args: unknown[]): void {
        if (this.isEnabled(LogLevelEnum.ERROR)) {
            console.error(`[ERROR] ${message}`, ...this.serializeArgs(args));
        }
    }

    log (message: string, ...args: unknown[]): void {
        console.log(`[LOG] ${message}`, ...this.serializeArgs(args));
    }
}

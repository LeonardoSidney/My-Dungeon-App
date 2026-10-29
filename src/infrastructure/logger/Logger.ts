import { ILogger, LOG_LEVEL_SEVERITY, LoggerChannels, LogLevel, LogLevelEnum, MASKED_LOG_VALUE, SENSITIVE_LOG_KEYS } from '@domain/logger';

export class Logger implements ILogger {
    private logLevel: LogLevel;
    private channels: LoggerChannels;
    constructor (logLevel: LogLevel = LogLevelEnum.DEBUG, channels: LoggerChannels = {}) {
        this.logLevel = logLevel;
        this.channels = channels;
    }

    private isEnabled (level: LogLevel): boolean {
        return LOG_LEVEL_SEVERITY[level] >= LOG_LEVEL_SEVERITY[this.logLevel];
    }

    private serializeArgs (args: unknown[]): unknown[] {
        return args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                try {
                    return JSON.stringify(arg, (key, value) => this.maskSensitiveValue(key, value));
                } catch {
                    return String(arg);
                }
            }
            return arg;
        });
    }

    private maskSensitiveValue (key: string, value: unknown): unknown {
        const isSensitive = SENSITIVE_LOG_KEYS.includes(key.toLowerCase());
        if (!isSensitive || typeof value !== 'string') {
            return value;
        }

        return MASKED_LOG_VALUE;
    }

    debug (message: string, ...args: unknown[]): void {
        if (this.isEnabled(LogLevelEnum.DEBUG)) {
            console.info(`[DEBUG] ${message}`, ...this.serializeArgs(args));
        }
    }

    storage (message: string, ...args: unknown[]): void {
        if (this.channels.storage) {
            console.info(`[STORAGE] ${message}`, ...this.serializeArgs(args));
        }
    }

    streaming (message: string, ...args: unknown[]): void {
        if (this.channels.streaming) {
            console.info(`[STREAMING] ${message}`, ...this.serializeArgs(args));
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

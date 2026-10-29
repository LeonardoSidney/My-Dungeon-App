import { ILogger } from '@domain/logger';

export class StreamingLogger implements ILogger {
    constructor (private readonly logger: ILogger) { }

    debug (message: string, ...args: unknown[]): void {
        this.logger.streaming(message, ...args);
    }

    storage (message: string, ...args: unknown[]): void {
        this.logger.storage(message, ...args);
    }

    streaming (message: string, ...args: unknown[]): void {
        this.logger.streaming(message, ...args);
    }

    info (message: string, ...args: unknown[]): void {
        this.logger.streaming(message, ...args);
    }

    warning (message: string, ...args: unknown[]): void {
        this.logger.warning(message, ...args);
    }

    error (message: string, ...args: unknown[]): void {
        this.logger.error(message, ...args);
    }

    log (message: string, ...args: unknown[]): void {
        this.logger.log(message, ...args);
    }
}

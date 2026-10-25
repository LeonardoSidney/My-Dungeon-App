import { ILogger } from '@domain/logger';
import { IBackgroundExecutionProvider } from '@domain/providers';
import NativeStreamingKeepAlive from './NativeStreamingKeepAlive';

export class BackgroundExecutionProvider implements IBackgroundExecutionProvider {
    private holders = 0;

    constructor (
        private readonly logger: ILogger
    ) { }

    acquire (): void {
        this.holders += 1;
        if (this.holders > 1 || !NativeStreamingKeepAlive) {
            return;
        }

        this.logger.info('BackgroundExecutionProvider::acquire - keeping the app alive while streaming');
        NativeStreamingKeepAlive.start().catch(error => {
            this.logger.warning('BackgroundExecutionProvider::acquire - failed to start the keep alive service', error);
        });
    }

    release (): void {
        if (this.holders === 0) {
            return;
        }

        this.holders -= 1;
        if (this.holders > 0 || !NativeStreamingKeepAlive) {
            return;
        }

        this.logger.info('BackgroundExecutionProvider::release - letting the system suspend the app again');
        NativeStreamingKeepAlive.stop().catch(error => {
            this.logger.warning('BackgroundExecutionProvider::release - failed to stop the keep alive service', error);
        });
    }
}

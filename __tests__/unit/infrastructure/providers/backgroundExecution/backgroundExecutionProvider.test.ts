import { ILogger } from '@domain/logger';
import NativeStreamingKeepAlive from '@infra/providers/backgroundExecution/NativeStreamingKeepAlive';
import { BackgroundExecutionProvider } from '@infra/providers/backgroundExecution';

jest.mock('@infra/providers/backgroundExecution/NativeStreamingKeepAlive', () => ({
    __esModule: true,
    default: {
        start: jest.fn(() => Promise.resolve()),
        stop: jest.fn(() => Promise.resolve()),
    },
}));

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const keepAlive = jest.mocked(NativeStreamingKeepAlive!);

describe('BackgroundExecutionProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('starts the keep alive service on the first acquire only', () => {
        const provider = new BackgroundExecutionProvider(logger);

        provider.acquire();
        provider.acquire();

        expect(keepAlive.start).toHaveBeenCalledTimes(1);
    });

    it('stops the keep alive service only after the last holder releases it', () => {
        const provider = new BackgroundExecutionProvider(logger);
        provider.acquire();
        provider.acquire();

        provider.release();
        expect(keepAlive.stop).not.toHaveBeenCalled();

        provider.release();
        expect(keepAlive.stop).toHaveBeenCalledTimes(1);
    });

    it('ignores a release without a matching acquire', () => {
        const provider = new BackgroundExecutionProvider(logger);

        provider.release();
        provider.acquire();

        expect(keepAlive.stop).not.toHaveBeenCalled();
        expect(keepAlive.start).toHaveBeenCalledTimes(1);
    });

    it('starts the keep alive service again for a new streaming period', () => {
        const provider = new BackgroundExecutionProvider(logger);
        provider.acquire();
        provider.release();

        provider.acquire();

        expect(keepAlive.start).toHaveBeenCalledTimes(2);
    });

    it('warns when the keep alive service fails to start', async () => {
        keepAlive.start.mockRejectedValueOnce(new Error('not allowed'));
        const provider = new BackgroundExecutionProvider(logger);

        provider.acquire();
        await Promise.resolve();

        expect(logger.warning).toHaveBeenCalledWith(expect.stringContaining('failed to start'), expect.any(Error));
    });

    it('warns when the keep alive service fails to stop', async () => {
        keepAlive.stop.mockRejectedValueOnce(new Error('not allowed'));
        const provider = new BackgroundExecutionProvider(logger);
        provider.acquire();

        provider.release();
        await Promise.resolve();

        expect(logger.warning).toHaveBeenCalledWith(expect.stringContaining('failed to stop'), expect.any(Error));
    });
});

import { LogLevelEnum } from '@domain/logger';
import { Logger } from '@infra/logger';

describe('Logger', () => {
    let info: jest.SpyInstance;
    let error: jest.SpyInstance;
    let log: jest.SpyInstance;

    beforeEach(() => {
        info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
        error = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        log = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it.each([
        ['debug', '[DEBUG]', () => info],
        ['info', '[INFO]', () => info],
        ['warning', '[WARN]', () => info],
        ['error', '[ERROR]', () => error],
        ['log', '[LOG]', () => log]
    ] as const)('writes %s messages with the %s prefix', (method, prefix, consoleMethod) => {
        new Logger()[method]('something happened', 'detail', 42);

        expect(consoleMethod()).toHaveBeenCalledWith(`${prefix} something happened`, 'detail', 42);
    });

    it('serializes objects as JSON', () => {
        new Logger().info('payload', { id: 'adv-1' }, ['a'], null);

        expect(info).toHaveBeenCalledWith('[INFO] payload', '{"id":"adv-1"}', '["a"]', null);
    });

    it('falls back to String for objects that cannot be serialized', () => {
        const circular: Record<string, unknown> = {};
        circular.self = circular;

        new Logger().info('payload', circular);

        expect(info).toHaveBeenCalledWith('[INFO] payload', '[object Object]');
    });

    it('only writes the messages at or above the configured level', () => {
        const logger = new Logger(LogLevelEnum.ERROR);

        logger.debug('debug message');
        logger.info('info message');
        logger.warning('warning message');
        logger.error('error message');
        logger.log('log message');

        expect(info).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith('[ERROR] error message');
        expect(log).toHaveBeenCalledWith('[LOG] log message');
    });

    it('always writes log messages, even when errors are filtered out', () => {
        const logger = new Logger(LogLevelEnum.LOG);

        logger.error('error message');
        logger.log('log message');

        expect(error).not.toHaveBeenCalled();
        expect(log).toHaveBeenCalledWith('[LOG] log message');
    });

    it('keeps the errors when the level is info', () => {
        const logger = new Logger(LogLevelEnum.INFO);

        logger.debug('debug message');
        logger.error('error message');

        expect(info).not.toHaveBeenCalled();
        expect(error).toHaveBeenCalledWith('[ERROR] error message');
    });
});

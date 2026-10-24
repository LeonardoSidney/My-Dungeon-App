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
});

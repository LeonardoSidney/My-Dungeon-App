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

    it('masks the auth token of a logged connection', () => {
        new Logger().debug('saving', { id: 'conn-1', ip: '192.168.0.2', auth: 'secret-key' });

        expect(info).toHaveBeenCalledWith('[DEBUG] saving', '{"id":"conn-1","ip":"192.168.0.2","auth":"***"}');
    });

    it('masks the auth tokens of every connection in a saved list', () => {
        new Logger().debug('saving', [{ id: 'conn-1', auth: 'first-key' }, { id: 'conn-2', auth: 'second-key' }]);

        expect(info).toHaveBeenCalledWith('[DEBUG] saving', '[{"id":"conn-1","auth":"***"},{"id":"conn-2","auth":"***"}]');
    });

    it('masks an authorization header inside a request', () => {
        new Logger().debug('request', { url: 'http://localhost/models', headers: { Authorization: 'Bearer secret-key' } });

        expect(info).toHaveBeenCalledWith('[DEBUG] request', '{"url":"http://localhost/models","headers":{"Authorization":"***"}}');
    });

    it('keeps a sensitive key whose value is not text', () => {
        new Logger().debug('connection', { id: 'conn-1', auth: null });

        expect(info).toHaveBeenCalledWith('[DEBUG] connection', '{"id":"conn-1","auth":null}');
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

    it('does not write storage messages when the storage log is disabled', () => {
        new Logger().storage('stored data', { id: 'adv-1' });

        expect(info).not.toHaveBeenCalled();
    });

    it('writes storage messages with the [STORAGE] prefix when the storage log is enabled', () => {
        new Logger(LogLevelEnum.DEBUG, { storage: true }).storage('stored data', { id: 'adv-1' });

        expect(info).toHaveBeenCalledWith('[STORAGE] stored data', '{"id":"adv-1"}');
    });

    it('writes storage messages whatever the configured level is', () => {
        new Logger(LogLevelEnum.ERROR, { storage: true }).storage('stored data');

        expect(info).toHaveBeenCalledWith('[STORAGE] stored data');
    });

    it('masks the auth token of a stored connection', () => {
        new Logger(LogLevelEnum.DEBUG, { storage: true }).storage('stored data', [{ id: 'conn-1', auth: 'secret-key' }]);

        expect(info).toHaveBeenCalledWith('[STORAGE] stored data', '[{"id":"conn-1","auth":"***"}]');
    });

    it('does not write storage messages through the debug level', () => {
        new Logger(LogLevelEnum.DEBUG).storage('stored data');
        new Logger(LogLevelEnum.DEBUG).debug('debug message');

        expect(info).toHaveBeenCalledTimes(1);
        expect(info).toHaveBeenCalledWith('[DEBUG] debug message');
    });

    it('does not write streaming messages when the streaming log is disabled', () => {
        new Logger().streaming('token saved', { chatId: 'chat-1' });

        expect(info).not.toHaveBeenCalled();
    });

    it('writes streaming messages with the [STREAMING] prefix when the streaming log is enabled', () => {
        new Logger(LogLevelEnum.DEBUG, { streaming: true }).streaming('token saved', { chatId: 'chat-1' });

        expect(info).toHaveBeenCalledWith('[STREAMING] token saved', '{"chatId":"chat-1"}');
    });

    it('writes streaming messages whatever the configured level is', () => {
        new Logger(LogLevelEnum.ERROR, { streaming: true }).streaming('token saved');

        expect(info).toHaveBeenCalledWith('[STREAMING] token saved');
    });

    it('does not write storage messages when only the streaming log is enabled', () => {
        const logger = new Logger(LogLevelEnum.DEBUG, { streaming: true });

        logger.storage('stored data');
        logger.streaming('token saved');

        expect(info).toHaveBeenCalledTimes(1);
        expect(info).toHaveBeenCalledWith('[STREAMING] token saved');
    });

    it('does not write streaming messages when only the storage log is enabled', () => {
        const logger = new Logger(LogLevelEnum.DEBUG, { storage: true });

        logger.streaming('token saved');
        logger.storage('stored data');

        expect(info).toHaveBeenCalledTimes(1);
        expect(info).toHaveBeenCalledWith('[STORAGE] stored data');
    });
});

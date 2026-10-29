import { ILogger } from '@domain/logger';
import { StreamingLogger } from '@infra/logger';

function buildBaseLogger (): jest.Mocked<ILogger> {
    return {
        debug: jest.fn(),
        storage: jest.fn(),
        streaming: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn(),
        log: jest.fn()
    };
}

describe('StreamingLogger', () => {
    it('writes debug messages as streaming messages', () => {
        const baseLogger = buildBaseLogger();

        new StreamingLogger(baseLogger).debug('chat updated', { chatId: 'chat-1' });

        expect(baseLogger.streaming).toHaveBeenCalledWith('chat updated', { chatId: 'chat-1' });
        expect(baseLogger.debug).not.toHaveBeenCalled();
    });

    it('writes info messages as streaming messages', () => {
        const baseLogger = buildBaseLogger();

        new StreamingLogger(baseLogger).info('Executing AdventureRepository::getAdventures');

        expect(baseLogger.streaming).toHaveBeenCalledWith('Executing AdventureRepository::getAdventures');
        expect(baseLogger.info).not.toHaveBeenCalled();
    });

    it('keeps streaming messages as streaming messages', () => {
        const baseLogger = buildBaseLogger();

        new StreamingLogger(baseLogger).streaming('token saved');

        expect(baseLogger.streaming).toHaveBeenCalledWith('token saved');
    });

    it('keeps storage messages as storage messages', () => {
        const baseLogger = buildBaseLogger();

        new StreamingLogger(baseLogger).storage('stored data', [{ id: 'adv-1' }]);

        expect(baseLogger.storage).toHaveBeenCalledWith('stored data', [{ id: 'adv-1' }]);
        expect(baseLogger.streaming).not.toHaveBeenCalled();
    });

    it('keeps warnings as warnings', () => {
        const baseLogger = buildBaseLogger();

        new StreamingLogger(baseLogger).warning('failed to load adventure', 'storage failed');

        expect(baseLogger.warning).toHaveBeenCalledWith('failed to load adventure', 'storage failed');
    });

    it('keeps errors as errors', () => {
        const baseLogger = buildBaseLogger();

        new StreamingLogger(baseLogger).error('failed to save adventure');

        expect(baseLogger.error).toHaveBeenCalledWith('failed to save adventure');
    });

    it('keeps log messages as log messages', () => {
        const baseLogger = buildBaseLogger();

        new StreamingLogger(baseLogger).log('always shown');

        expect(baseLogger.log).toHaveBeenCalledWith('always shown');
    });
});

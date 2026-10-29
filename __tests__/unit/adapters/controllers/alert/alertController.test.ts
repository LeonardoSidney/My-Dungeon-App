import { AlertController } from '@adapters/controllers';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('AlertController', () => {
    it('forwards the alert to the use case', async () => {
        const execute = jest.fn();

        await new AlertController(logger, { execute }).handle({ title: 'Saved', message: 'The adventure was saved' });

        expect(execute).toHaveBeenCalledWith({ title: 'Saved', message: 'The adventure was saved' });
    });
});

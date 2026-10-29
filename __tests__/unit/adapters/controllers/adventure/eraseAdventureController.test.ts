import { EraseAdventureController } from '@adapters/controllers';
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

describe('EraseAdventureController', () => {
    it('forwards the adventure id and only acknowledges the command', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true });

        const response = await new EraseAdventureController(logger, { execute }).handle({ id: 'adv-1' });

        expect(execute).toHaveBeenCalledWith({ id: 'adv-1' });
        expect(response).toEqual({ success: true, error: undefined });
    });

    it('forwards the use case error', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Adventure with id adv-1 not found' });

        const response = await new EraseAdventureController(logger, { execute }).handle({ id: 'adv-1' });

        expect(response).toEqual({ success: false, error: 'Adventure with id adv-1 not found' });
    });
});

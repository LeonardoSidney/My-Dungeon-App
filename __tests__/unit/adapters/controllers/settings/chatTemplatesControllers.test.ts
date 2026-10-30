import { GetChatTemplatesController, SaveChatTemplatesController } from '@adapters/controllers';
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

describe('chat templates controllers', () => {
    it('returns the answer of the get use case', async () => {
        const answer = { success: false, error: 'Storage failure' };
        const execute = jest.fn().mockResolvedValue(answer);

        const response = await new GetChatTemplatesController(logger, { execute }).handle();

        expect(response).toEqual(answer);
    });

    it('forwards the save request', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true });

        const response = await new SaveChatTemplatesController(logger, { execute }).handle({ templates: { worlds: '{worlds}' } });

        expect(execute).toHaveBeenCalledWith({ templates: { worlds: '{worlds}' } });
        expect(response).toEqual({ success: true });
    });
});

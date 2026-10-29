import {
    GetSystemPromptLoadOrderController,
    ResetSystemPromptLoadOrderController,
    SaveSystemPromptLoadOrderController,
} from '@adapters/controllers';
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

describe('system prompt load order controllers', () => {
    it('returns the load order from the get use case', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, loadOrder: '{characters}' });

        const response = await new GetSystemPromptLoadOrderController(logger, { execute }).handle();

        expect(response).toEqual({ success: true, loadOrder: '{characters}' });
    });

    it('forwards the save request', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Invalid tag: {abacate}' });

        const response = await new SaveSystemPromptLoadOrderController(logger, { execute }).handle({ loadOrder: '{abacate}' });

        expect(execute).toHaveBeenCalledWith({ loadOrder: '{abacate}' });
        expect(response).toEqual({ success: false, error: 'Invalid tag: {abacate}' });
    });

    it('returns the default load order from the reset use case', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, loadOrder: '{systemPrompt}' });

        const response = await new ResetSystemPromptLoadOrderController(logger, { execute }).handle();

        expect(execute).toHaveBeenCalledWith();
        expect(response).toEqual({ success: true, loadOrder: '{systemPrompt}' });
    });
});

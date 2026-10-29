import { GetAdventureSystemPromptController, GetAdventureTemplatedPromptController } from '@adapters/controllers';
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

describe('GetAdventureSystemPromptController', () => {
    it('asks for the adventure by id and returns the system prompt as a string', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, systemPrompt: 'You are the narrator' });

        const response = await new GetAdventureSystemPromptController(logger, { execute }).handle({ adventureId: 'adv-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adv-1' });
        expect(response).toEqual({ success: true, data: 'You are the narrator', error: undefined });
    });

    it('forwards the use case error', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'No system prompt' });

        const response = await new GetAdventureSystemPromptController(logger, { execute }).handle({ adventureId: 'adv-1' });

        expect(response).toEqual({ success: false, data: undefined, error: 'No system prompt' });
    });
});

describe('GetAdventureTemplatedPromptController', () => {
    it('asks for the adventure by id and returns the templated prompt as a string', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, prompt: '<|system|>...<|user|>...' });

        const response = await new GetAdventureTemplatedPromptController(logger, { execute }).handle({ adventureId: 'adv-1' });

        expect(execute).toHaveBeenCalledWith({ adventureId: 'adv-1' });
        expect(response).toEqual({ success: true, data: '<|system|>...<|user|>...', error: undefined });
    });

    it('forwards the model template failure', async () => {
        const execute = jest.fn().mockResolvedValue({ success: false, error: 'Model did not return a prompt' });

        const response = await new GetAdventureTemplatedPromptController(logger, { execute }).handle({ adventureId: 'adv-1' });

        expect(response).toEqual({ success: false, data: undefined, error: 'Model did not return a prompt' });
    });
});

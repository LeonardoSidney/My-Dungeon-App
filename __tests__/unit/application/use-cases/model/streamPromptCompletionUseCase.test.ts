import { StreamPromptCompletionUseCase } from '@application/use-cases';
import { DEFAULT_SAMPLER } from '@domain/constants/sampler';
import { ILogger } from '@domain/logger';
import { createConnectionHelper, createModelHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const second = createConnectionHelper({ id: 'c2', name: 'Remote' });

describe('StreamPromptCompletionUseCase', () => {
    it('streams with the first loaded model and the default sampler', async () => {
        const listModels = { execute: jest.fn().mockResolvedValue({ success: true, models: [{ model: createModelHelper({ id: 'm2' }), connection: second }] }) };
        const streamCompletion = { execute: jest.fn().mockResolvedValue({ success: true }) };
        const useCase = new StreamPromptCompletionUseCase(logger, listModels, streamCompletion);

        await useCase.execute({ prompt: 'Once upon' });

        expect(listModels.execute).toHaveBeenCalledWith({ loadedOnly: true });
        expect(streamCompletion.execute).toHaveBeenCalledWith({
            connectionId: 'c2',
            samplerId: DEFAULT_SAMPLER.id,
            modelId: 'm2',
            prompt: 'Once upon',
        });
    });

    it('fails when no connection has a loaded model', async () => {
        const useCase = new StreamPromptCompletionUseCase(
            logger,
            { execute: jest.fn().mockResolvedValue({ success: true, models: [] }) },
            { execute: jest.fn() }
        );

        const response = await useCase.execute({ prompt: 'Once upon' });

        expect(response).toEqual({ success: false, error: 'No loaded model found on any connection' });
    });

    it('fails without listing models when the prompt is blank', async () => {
        const listModels = { execute: jest.fn() };
        const useCase = new StreamPromptCompletionUseCase(logger, listModels, { execute: jest.fn() });

        const response = await useCase.execute({ prompt: '  ' });

        expect(response).toEqual({ success: false, error: 'Prompt is required' });
        expect(listModels.execute).not.toHaveBeenCalled();
    });

    it('fails when listing the models fails', async () => {
        const useCase = new StreamPromptCompletionUseCase(
            logger,
            { execute: jest.fn().mockResolvedValue({ success: false, error: 'Database error' }) },
            { execute: jest.fn() }
        );

        const response = await useCase.execute({ prompt: 'Once upon' });

        expect(response).toEqual({ success: false, error: 'No loaded model found on any connection' });
    });
});

import { NativeStreamCompletionUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createConnectionHelper, createSamplerHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const connection = createConnectionHelper({ id: 'c1' });
const sampler = createSamplerHelper({ id: 's1' });
const params = { connectionId: 'c1', samplerId: 's1', modelId: 'm1', prompt: 'Once upon' };
const stream = {} as AsyncIterable<string>;
const abort = jest.fn();

function buildUseCase (connectionResponse: unknown = { success: true, connection }, samplerResponse: unknown = { success: true, sampler }) {
    const gateway = { streamCompletion: jest.fn().mockReturnValue({ stream, abort }) };
    const connectionRepository = { getConnectionById: jest.fn().mockResolvedValue(connectionResponse) };
    const samplerRepository = { getSamplerById: jest.fn().mockResolvedValue(samplerResponse) };
    const getSamplersService = { findSystemDefaultSampler: jest.fn() };
    const useCase = new NativeStreamCompletionUseCase(logger, gateway as never, connectionRepository as never, samplerRepository as never, getSamplersService as never);

    return { useCase, gateway, connectionRepository };
}

describe('NativeStreamCompletionUseCase', () => {
    it('streams the prompt with the connection and the sampler', async () => {
        const { useCase, gateway } = buildUseCase();

        const response = await useCase.execute(params);

        expect(response).toEqual({ success: true, stream, abort });
        expect(gateway.streamCompletion).toHaveBeenCalledWith({ connection, sampler, modelId: 'm1', prompt: 'Once upon' });
    });

    it('fails without loading the connection when the connection id is blank', async () => {
        const { useCase, connectionRepository } = buildUseCase();

        const response = await useCase.execute({ ...params, connectionId: '  ' });

        expect(response).toEqual({ success: false, error: 'Connection id is required' });
        expect(connectionRepository.getConnectionById).not.toHaveBeenCalled();
    });

    it('fails when the connection id is missing', async () => {
        const { useCase } = buildUseCase();

        const response = await useCase.execute({ ...params, connectionId: undefined } as never);

        expect(response).toEqual({ success: false, error: 'Connection id is required' });
    });

    it('fails when the sampler id is blank', async () => {
        const { useCase } = buildUseCase();

        const response = await useCase.execute({ ...params, samplerId: '  ' });

        expect(response).toEqual({ success: false, error: 'Sampler id is required' });
    });

    it('fails when the sampler id is missing', async () => {
        const { useCase } = buildUseCase();

        const response = await useCase.execute({ ...params, samplerId: undefined } as never);

        expect(response).toEqual({ success: false, error: 'Sampler id is required' });
    });

    it('fails when the prompt is blank', async () => {
        const { useCase } = buildUseCase();

        const response = await useCase.execute({ ...params, prompt: '  ' });

        expect(response).toEqual({ success: false, error: 'Prompt is required' });
    });

    it('fails when the prompt is missing', async () => {
        const { useCase } = buildUseCase();

        const response = await useCase.execute({ ...params, prompt: undefined } as never);

        expect(response).toEqual({ success: false, error: 'Prompt is required' });
    });

    it('returns the repository error when the connection cannot be loaded', async () => {
        const { useCase, gateway } = buildUseCase({ success: false, error: 'Database error' });

        const response = await useCase.execute(params);

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(gateway.streamCompletion).not.toHaveBeenCalled();
    });

    it('fails naming the collection when the connection does not exist', async () => {
        const { useCase, gateway } = buildUseCase({ success: true });

        const response = await useCase.execute(params);

        expect(response).toEqual({ success: false, error: 'Entity not found for id: c1 from Connections' });
        expect(gateway.streamCompletion).not.toHaveBeenCalled();
    });

    it('returns the repository error when the sampler cannot be loaded', async () => {
        const { useCase, gateway } = buildUseCase({ success: true, connection }, { success: false, error: 'Database error' });

        const response = await useCase.execute(params);

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(gateway.streamCompletion).not.toHaveBeenCalled();
    });

    it('fails naming the collection when the sampler does not exist', async () => {
        const { useCase, gateway } = buildUseCase({ success: true, connection }, { success: true });

        const response = await useCase.execute(params);

        expect(response).toEqual({ success: false, error: 'Entity not found for id: s1 from Samplers' });
        expect(gateway.streamCompletion).not.toHaveBeenCalled();
    });
});

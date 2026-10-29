import { GetSamplerByIdUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { createSamplerHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

function build (lookup: jest.Mock, systemDefault?: unknown) {
    const repository = { getSamplerById: lookup };
    const service = { findSystemDefaultSampler: jest.fn().mockReturnValue(systemDefault) };
    return new GetSamplerByIdUseCase(logger, repository as never, service as never);
}

describe('GetSamplerByIdUseCase', () => {
    it('resolves system default samplers that are not stored', async () => {
        const systemDefault = createSamplerHelper({ id: 'default-1', systemDefault: true });
        const repository = { getSamplerById: jest.fn().mockResolvedValue({ success: true, sampler: undefined }) };
        const service = { findSystemDefaultSampler: jest.fn().mockReturnValue(systemDefault) };
        const useCase = new GetSamplerByIdUseCase(logger, repository as never, service as never);

        const response = await useCase.execute({ id: 'default-1' });

        expect(response).toEqual({ success: true, sampler: systemDefault });
    });

    it('returns the stored sampler', async () => {
        const stored = createSamplerHelper({ id: 's1' });
        const lookup = jest.fn().mockResolvedValue({ success: true, sampler: stored });

        const response = await build(lookup).execute({ id: 's1' });

        expect(lookup).toHaveBeenCalledWith('s1');
        expect(response).toEqual({ success: true, sampler: stored });
    });

    it('fails when the sampler is neither stored nor a system default', async () => {
        const response = await build(jest.fn().mockResolvedValue({ success: true })).execute({ id: 'missing' });

        expect(response).toEqual({ success: false, error: 'Sampler with id missing not found' });
    });

    it('propagates a repository failure as an error result', async () => {
        const response = await build(jest.fn().mockResolvedValue({ success: false, error: 'storage offline' })).execute({ id: 's1' });

        expect(response).toEqual({ success: false, error: 'storage offline' });
    });

    it('fails without querying when the id is blank', async () => {
        const lookup = jest.fn();

        const response = await build(lookup).execute({ id: '  ' });

        expect(response).toEqual({ success: false, error: 'Sampler id is required' });
        expect(lookup).not.toHaveBeenCalled();
    });
});

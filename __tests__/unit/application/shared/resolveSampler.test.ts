import { createSamplerResolver } from '@application/shared/resolveSampler';
import { ISamplerRepository } from '@domain/repository';
import { IGetSamplersService } from '@domain/services';
import { createSamplerHelper } from '@test/helpers';

const samplerRepository = { getSamplerById: jest.fn() };
const getSamplersService = { findSystemDefaultSampler: jest.fn() };

function buildResolver () {
    return createSamplerResolver(
        samplerRepository as unknown as ISamplerRepository,
        getSamplersService as unknown as IGetSamplersService
    );
}

describe('createSamplerResolver', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should prefer the stored sampler without looking for a system default', async () => {
        const storedSampler = createSamplerHelper({ id: 'sampler-1' });
        samplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: storedSampler });
        getSamplersService.findSystemDefaultSampler.mockReturnValue(createSamplerHelper({ id: 'sampler-1', systemDefault: true }));

        const response = await buildResolver()('sampler-1');

        expect(response).toEqual({ success: true, sampler: storedSampler });
        expect(getSamplersService.findSystemDefaultSampler).not.toHaveBeenCalled();
    });

    it('should fall back to the system default when the sampler is not stored', async () => {
        const systemDefault = createSamplerHelper({ id: 'sampler-1', systemDefault: true });
        samplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: undefined });
        getSamplersService.findSystemDefaultSampler.mockReturnValue(systemDefault);

        const response = await buildResolver()('sampler-1');

        expect(response).toEqual({ success: true, sampler: systemDefault });
        expect(getSamplersService.findSystemDefaultSampler).toHaveBeenCalledWith('sampler-1');
    });

    it('should answer without a sampler when it is neither stored nor a system default', async () => {
        samplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: undefined });
        getSamplersService.findSystemDefaultSampler.mockReturnValue(undefined);

        const response = await buildResolver()('gone');

        expect(response).toEqual({ success: true, sampler: undefined });
    });

    it('should return a repository failure without looking for a system default', async () => {
        const failure = { success: false, error: 'Storage offline' };
        samplerRepository.getSamplerById.mockResolvedValue(failure);

        const response = await buildResolver()('sampler-1');

        expect(response).toBe(failure);
        expect(getSamplersService.findSystemDefaultSampler).not.toHaveBeenCalled();
    });
});

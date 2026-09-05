import { CreateSamplerUseCase } from '@application/use-cases';
import { ICreateSamplerService, IGetSamplersService } from '@domain/services';
import { ISamplerRepository } from '@domain/repository';
import { ILogger } from '@domain/logger';
import { Sampler } from '@domain/entities';
import { createSamplerHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockSamplerRepository = {
    getSamplers: jest.fn().mockResolvedValue([]),
    getSamplerById: jest.fn().mockResolvedValue(undefined),
    saveSampler: jest.fn().mockResolvedValue(true),
    editSampler: jest.fn().mockResolvedValue({ success: true }),
    eraseSampler: jest.fn().mockResolvedValue({ success: true })
};

const mockService = {
    createSampler: jest.fn()
};

const mockGetSamplersService = {
    getSystemDefaultSamplers: jest.fn().mockReturnValue([
        createSamplerHelper({
            id: 'd159dd93-77da-427b-9407-3d695a13e554',
            name: 'top_k',
            systemDefault: true
        })
    ]),
    findSystemDefaultSampler: jest.fn().mockReturnValue(undefined)
};

function buildUseCase (): CreateSamplerUseCase {
    return new CreateSamplerUseCase(
        mockLogger,
        mockSamplerRepository as unknown as ISamplerRepository,
        mockService as unknown as ICreateSamplerService,
        mockGetSamplersService as unknown as IGetSamplersService
    );
}

describe('CreateSamplerUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockSamplerRepository.getSamplers.mockResolvedValue([]);
        mockGetSamplersService.getSystemDefaultSamplers.mockReturnValue([
            createSamplerHelper({
                id: 'd159dd93-77da-427b-9407-3d695a13e554',
                name: 'top_k',
                systemDefault: true
            })
        ]);
    });

    it('should fail when creating a sampler named top_k', async () => {
        const useCase = buildUseCase();

        const response = await useCase.execute({
            name: 'top_k',
            observation: 'Collision with the system default'
        });

        expect(response.success).toBe(false);
        expect(response.error).toContain('reserved for a system default sampler');
        expect(mockService.createSampler).not.toHaveBeenCalled();
        expect(mockSamplerRepository.saveSampler).not.toHaveBeenCalled();
    });

    it('should fail when the name matches any system default sampler name', async () => {
        const secondDefault: Sampler = createSamplerHelper({
            id: 'system-2',
            name: 'greedy',
            systemDefault: true
        });
        mockGetSamplersService.getSystemDefaultSamplers.mockReturnValue([
            createSamplerHelper({
                id: 'd159dd93-77da-427b-9407-3d695a13e554',
                name: 'top_k',
                systemDefault: true
            }),
            secondDefault
        ]);
        const useCase = buildUseCase();

        const response = await useCase.execute({ name: 'greedy' });

        expect(response.success).toBe(false);
        expect(response.error).toContain('"greedy" is reserved');
        expect(mockSamplerRepository.saveSampler).not.toHaveBeenCalled();
    });

    it('should succeed when creating a sampler with a normal name', async () => {
        const created: Sampler = createSamplerHelper({ name: 'creative-narrative' });
        mockService.createSampler.mockReturnValue({ success: true, sampler: created });
        const useCase = buildUseCase();

        const response = await useCase.execute({
            name: 'creative-narrative',
            temperature: 0.9
        });

        expect(response.success).toBe(true);
        expect(response.sampler?.name).toBe('creative-narrative');
        expect(mockSamplerRepository.saveSampler).toHaveBeenCalledWith({ sampler: created });
    });
});

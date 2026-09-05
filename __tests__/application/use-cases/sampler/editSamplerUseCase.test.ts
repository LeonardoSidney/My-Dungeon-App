import { EditSamplerUseCase } from '@application/use-cases';
import { IEditSamplerService, IGetSamplersService } from '@domain/services';
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
    editSampler: jest.fn()
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

function buildUseCase (): EditSamplerUseCase {
    return new EditSamplerUseCase(
        mockLogger,
        mockService as unknown as IEditSamplerService,
        mockSamplerRepository as unknown as ISamplerRepository,
        mockGetSamplersService as unknown as IGetSamplersService
    );
}

describe('EditSamplerUseCase', () => {
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

    it('should fail when editing a sampler to the name top_k', async () => {
        const useCase = buildUseCase();

        const response = await useCase.execute({
            id: '1',
            editParams: {
                name: 'top_k',
                systemDefault: false
            }
        });

        expect(response.success).toBe(false);
        expect(response.error).toContain('reserved for a system default sampler');
        expect(mockSamplerRepository.getSamplerById).not.toHaveBeenCalled();
        expect(mockSamplerRepository.editSampler).not.toHaveBeenCalled();
    });

    it('should fail when the target name matches any system default sampler name', async () => {
        mockGetSamplersService.getSystemDefaultSamplers.mockReturnValue([
            createSamplerHelper({
                id: 'd159dd93-77da-427b-9407-3d695a13e554',
                name: 'top_k',
                systemDefault: true
            }),
            createSamplerHelper({
                id: 'system-2',
                name: 'greedy',
                systemDefault: true
            })
        ]);
        const useCase = buildUseCase();

        const response = await useCase.execute({
            id: '1',
            editParams: {
                name: 'greedy',
                systemDefault: false
            }
        });

        expect(response.success).toBe(false);
        expect(response.error).toContain('"greedy" is reserved');
        expect(mockSamplerRepository.editSampler).not.toHaveBeenCalled();
    });

    it('should succeed when editing a sampler with a normal name', async () => {
        const existing: Sampler = createSamplerHelper({ id: '1', name: 'old-name' });
        mockSamplerRepository.getSamplerById.mockResolvedValue(existing);
        mockSamplerRepository.getSamplers.mockResolvedValue([]);
        const edited: Sampler = createSamplerHelper({ id: '1', name: 'new-name' });
        mockService.editSampler.mockReturnValue({ success: true, sampler: edited });
        const useCase = buildUseCase();

        const response = await useCase.execute({
            id: '1',
            editParams: {
                name: 'new-name',
                systemDefault: false
            }
        });

        expect(response.success).toBe(true);
        expect(response.sampler?.name).toBe('new-name');
        expect(mockSamplerRepository.editSampler).toHaveBeenCalledWith({ sampler: edited });
    });
});

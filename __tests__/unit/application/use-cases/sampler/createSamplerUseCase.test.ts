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
    getSamplers: jest.fn().mockResolvedValue({ success: true, samplers: [] }),
    getSamplerById: jest.fn().mockResolvedValue({ success: true, sampler: undefined }),
    saveSampler: jest.fn().mockResolvedValue({ success: true }),
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
        mockSamplerRepository.getSamplers.mockResolvedValue({ success: true, samplers: [] });
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
        expect(response.id).toBe(created.id);
        expect(mockSamplerRepository.saveSampler).toHaveBeenCalledWith({ sampler: created });
    });

    it('should fail when the name is blank', async () => {
        const response = await buildUseCase().execute({ name: '   ' });

        expect(response).toEqual({ success: false, error: 'A name is required to create a sampler' });
        expect(mockService.createSampler).not.toHaveBeenCalled();
    });

    it.each([0, -0.5, 1.5])('should fail when the adaptative target is %p', async (adaptativeTarget) => {
        const response = await buildUseCase().execute({ name: 'custom', adaptativeTarget });

        expect(response).toEqual({ success: false, error: 'Adaptative target must be greater than 0 and up to 1 to create a sampler' });
    });

    it.each([0, -0.5, 1.5])('should fail when the adaptative decay is %p', async (adaptativeDecay) => {
        const response = await buildUseCase().execute({ name: 'custom', adaptativeDecay });

        expect(response).toEqual({ success: false, error: 'Adaptative decay must be greater than 0 and up to 1 to create a sampler' });
    });

    it('should accept adaptative values inside the allowed range', async () => {
        const created: Sampler = createSamplerHelper({ name: 'custom' });
        mockService.createSampler.mockReturnValue({ success: true, sampler: created });

        const response = await buildUseCase().execute({ name: 'custom', adaptativeTarget: 1, adaptativeDecay: 0.5 });

        expect(response).toEqual({ success: true, id: created.id });
    });

    it('should return the service error when the service fails', async () => {
        mockService.createSampler.mockReturnValue({ success: false, error: 'Invalid sampler' });

        const response = await buildUseCase().execute({ name: 'custom' });

        expect(response).toEqual({ success: false, error: 'Invalid sampler' });
        expect(mockSamplerRepository.saveSampler).not.toHaveBeenCalled();
    });

    it('should fail when the service succeeds without a sampler', async () => {
        mockService.createSampler.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ name: 'custom' });

        expect(response).toEqual({ success: false, error: 'Something went wrong when creating the sampler' });
    });

    it('should return the repository error when the samplers cannot be loaded', async () => {
        mockService.createSampler.mockReturnValue({ success: true, sampler: createSamplerHelper({ name: 'custom' }) });
        mockSamplerRepository.getSamplers.mockResolvedValue({ success: false, error: 'Database error' });

        const response = await buildUseCase().execute({ name: 'custom' });

        expect(response).toEqual({ success: false, error: 'Database error' });
        expect(mockSamplerRepository.saveSampler).not.toHaveBeenCalled();
    });

    it('should fail when a sampler with the same name already exists', async () => {
        mockService.createSampler.mockReturnValue({ success: true, sampler: createSamplerHelper({ id: 'new', name: 'custom' }) });
        mockSamplerRepository.getSamplers.mockResolvedValue({
            success: true,
            samplers: [createSamplerHelper({ id: 'other', name: 'another' }), createSamplerHelper({ id: 'old', name: 'custom' })]
        });

        const response = await buildUseCase().execute({ name: 'custom' });

        expect(response).toEqual({ success: false, error: 'A sampler with this name already exists' });
        expect(mockSamplerRepository.saveSampler).not.toHaveBeenCalled();
    });

    it('should return the repository error when saving fails', async () => {
        mockService.createSampler.mockReturnValue({ success: true, sampler: createSamplerHelper({ name: 'custom' }) });
        mockSamplerRepository.saveSampler.mockResolvedValueOnce({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ name: 'custom' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });
});

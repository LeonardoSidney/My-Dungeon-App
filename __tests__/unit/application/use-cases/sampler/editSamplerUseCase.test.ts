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
    getSamplers: jest.fn().mockResolvedValue({ success: true, samplers: [] }),
    getSamplerById: jest.fn().mockResolvedValue({ success: true, sampler: undefined }),
    saveSampler: jest.fn().mockResolvedValue({ success: true }),
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
        mockSamplerRepository.getSamplers.mockResolvedValue({ success: true, samplers: [] });
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
                name: 'top_k'
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
                name: 'greedy'
            }
        });

        expect(response.success).toBe(false);
        expect(response.error).toContain('"greedy" is reserved');
        expect(mockSamplerRepository.editSampler).not.toHaveBeenCalled();
    });

    it('should succeed when editing a sampler with a normal name', async () => {
        const existing: Sampler = createSamplerHelper({ id: '1', name: 'old-name' });
        mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: existing });
        mockSamplerRepository.getSamplers.mockResolvedValue({ success: true, samplers: [] });
        const edited: Sampler = createSamplerHelper({ id: '1', name: 'new-name' });
        mockService.editSampler.mockReturnValue({ success: true, sampler: edited });
        const useCase = buildUseCase();

        const response = await useCase.execute({
            id: '1',
            editParams: {
                name: 'new-name'
            }
        });

        expect(response.success).toBe(true);
        expect(response.id).toBe('1');
        expect(mockSamplerRepository.editSampler).toHaveBeenCalledWith({ sampler: edited });
    });

    describe('failures', () => {
        const existing: Sampler = createSamplerHelper({ id: '1', name: 'old-name' });
        const edited: Sampler = createSamplerHelper({ id: '1', name: 'new-name' });

        beforeEach(() => {
            mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: existing });
            mockService.editSampler.mockReturnValue({ success: true, sampler: edited });
        });

        it('should fail when the id is blank', async () => {
            const response = await buildUseCase().execute({ id: ' ', editParams: { name: 'new-name' } });

            expect(response).toEqual({ success: false, error: 'A sampler id is required to edit a sampler' });
            expect(mockSamplerRepository.getSamplerById).not.toHaveBeenCalled();
        });

        it('should fail when the name is blank', async () => {
            const response = await buildUseCase().execute({ id: '1', editParams: { name: ' ' } });

            expect(response).toEqual({ success: false, error: 'A name is required to edit a sampler' });
        });

        it('should return the repository error when the sampler cannot be loaded', async () => {
            mockSamplerRepository.getSamplerById.mockResolvedValue({ success: false, error: 'Database error' });

            const response = await buildUseCase().execute({ id: '1', editParams: { name: 'new-name' } });

            expect(response).toEqual({ success: false, error: 'Database error' });
            expect(mockService.editSampler).not.toHaveBeenCalled();
        });

        it('should fail when the sampler does not exist', async () => {
            mockSamplerRepository.getSamplerById.mockResolvedValue({ success: true, sampler: undefined });

            const response = await buildUseCase().execute({ id: '1', editParams: { name: 'new-name' } });

            expect(response).toEqual({ success: false, error: 'Sampler with id 1 not found' });
        });

        it.each([
            [{ success: false, error: 'Invalid sampler' }, 'Invalid sampler'],
            [{ success: false }, 'An unknown error occurred on EditSamplerService'],
            [{ success: true }, 'Success is true but does not have a sampler']
        ])('should fail when the service answers %j', async (serviceResponse, error) => {
            mockService.editSampler.mockReturnValue(serviceResponse);

            const response = await buildUseCase().execute({ id: '1', editParams: { name: 'new-name' } });

            expect(response).toEqual({ success: false, error });
            expect(mockSamplerRepository.editSampler).not.toHaveBeenCalled();
        });

        it('should return the repository error when the samplers cannot be loaded', async () => {
            mockSamplerRepository.getSamplers.mockResolvedValue({ success: false, error: 'Database error' });

            const response = await buildUseCase().execute({ id: '1', editParams: { name: 'new-name' } });

            expect(response).toEqual({ success: false, error: 'Database error' });
        });

        it('should fail when another sampler already has the new name', async () => {
            mockSamplerRepository.getSamplers.mockResolvedValue({
                success: true,
                samplers: [edited, createSamplerHelper({ id: '2', name: 'new-name' })]
            });

            const response = await buildUseCase().execute({ id: '1', editParams: { name: 'new-name' } });

            expect(response).toEqual({ success: false, error: 'Sampler with name new-name already exists' });
            expect(mockSamplerRepository.editSampler).not.toHaveBeenCalled();
        });

        it.each([
            [{ success: false, error: 'Disk full' }, 'Disk full'],
            [{ success: false }, 'Failed to save sampler']
        ])('should fail when saving answers %j', async (saveResponse, error) => {
            mockSamplerRepository.editSampler.mockResolvedValueOnce(saveResponse);

            const response = await buildUseCase().execute({ id: '1', editParams: { name: 'new-name' } });

            expect(response).toEqual({ success: false, error });
        });
    });
});

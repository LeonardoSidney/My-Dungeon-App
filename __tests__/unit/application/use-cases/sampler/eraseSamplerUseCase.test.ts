import { EraseSamplerUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { ISamplerRepository } from '@domain/repository';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockRepository = {
    eraseSampler: jest.fn()
};

function buildUseCase (): EraseSamplerUseCase {
    return new EraseSamplerUseCase(
        mockLogger,
        mockRepository as unknown as ISamplerRepository
    );
}

describe('EraseSamplerUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseSampler.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseSampler).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A sampler id is required to erase a sampler' });
        expect(mockRepository.eraseSampler).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A sampler id is required to erase a sampler' });
        expect(mockRepository.eraseSampler).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseSampler.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseSampler.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase sampler' });
    });
});

import { EraseProficiencyUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IProficiencyRepository } from '@domain/repository';

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
    eraseProficiency: jest.fn()
};

function buildUseCase (): EraseProficiencyUseCase {
    return new EraseProficiencyUseCase(
        mockLogger,
        mockRepository as unknown as IProficiencyRepository
    );
}

describe('EraseProficiencyUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseProficiency.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseProficiency).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A proficiency id is required to erase a proficiency' });
        expect(mockRepository.eraseProficiency).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A proficiency id is required to erase a proficiency' });
        expect(mockRepository.eraseProficiency).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseProficiency.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseProficiency.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase proficiency' });
    });
});

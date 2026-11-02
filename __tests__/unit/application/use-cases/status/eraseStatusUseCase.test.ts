import { EraseStatusUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IStatusRepository } from '@domain/repository';

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
    eraseStatus: jest.fn()
};

function buildUseCase (): EraseStatusUseCase {
    return new EraseStatusUseCase(
        mockLogger,
        mockRepository as unknown as IStatusRepository
    );
}

describe('EraseStatusUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseStatus.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseStatus).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A status id is required to erase a status' });
        expect(mockRepository.eraseStatus).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A status id is required to erase a status' });
        expect(mockRepository.eraseStatus).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseStatus.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseStatus.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase status' });
    });
});

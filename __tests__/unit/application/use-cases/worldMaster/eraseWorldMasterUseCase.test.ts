import { EraseWorldMasterUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IWorldMasterRepository } from '@domain/repository';

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
    eraseWorldMaster: jest.fn()
};

function buildUseCase (): EraseWorldMasterUseCase {
    return new EraseWorldMasterUseCase(
        mockLogger,
        mockRepository as unknown as IWorldMasterRepository
    );
}

describe('EraseWorldMasterUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseWorldMaster.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseWorldMaster).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A world master id is required to erase a world master' });
        expect(mockRepository.eraseWorldMaster).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A world master id is required to erase a world master' });
        expect(mockRepository.eraseWorldMaster).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseWorldMaster.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseWorldMaster.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase world master' });
    });
});

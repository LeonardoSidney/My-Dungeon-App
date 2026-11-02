import { EraseWorldUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IWorldRepository } from '@domain/repository';

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
    eraseWorld: jest.fn()
};

function buildUseCase (): EraseWorldUseCase {
    return new EraseWorldUseCase(
        mockLogger,
        mockRepository as unknown as IWorldRepository
    );
}

describe('EraseWorldUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseWorld.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseWorld).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A world id is required to erase a world' });
        expect(mockRepository.eraseWorld).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A world id is required to erase a world' });
        expect(mockRepository.eraseWorld).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseWorld.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseWorld.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase world' });
    });
});

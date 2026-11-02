import { EraseItemUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IItemRepository } from '@domain/repository';

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
    eraseItem: jest.fn()
};

function buildUseCase (): EraseItemUseCase {
    return new EraseItemUseCase(
        mockLogger,
        mockRepository as unknown as IItemRepository
    );
}

describe('EraseItemUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseItem.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseItem).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'An item id is required to erase an item' });
        expect(mockRepository.eraseItem).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'An item id is required to erase an item' });
        expect(mockRepository.eraseItem).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseItem.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseItem.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase item' });
    });
});

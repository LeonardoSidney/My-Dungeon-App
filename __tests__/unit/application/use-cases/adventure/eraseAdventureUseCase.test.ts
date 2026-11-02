import { EraseAdventureUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAdventureRepository } from '@domain/repository';

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
    eraseAdventure: jest.fn()
};

function buildUseCase (): EraseAdventureUseCase {
    return new EraseAdventureUseCase(
        mockLogger,
        mockRepository as unknown as IAdventureRepository
    );
}

describe('EraseAdventureUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseAdventure.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseAdventure).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'An adventure id is required to erase an adventure' });
        expect(mockRepository.eraseAdventure).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'An adventure id is required to erase an adventure' });
        expect(mockRepository.eraseAdventure).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseAdventure.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseAdventure.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase adventure' });
    });
});

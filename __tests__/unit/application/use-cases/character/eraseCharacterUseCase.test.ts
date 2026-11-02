import { EraseCharacterUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { ICharacterRepository } from '@domain/repository';

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
    eraseCharacter: jest.fn()
};

function buildUseCase (): EraseCharacterUseCase {
    return new EraseCharacterUseCase(
        mockLogger,
        mockRepository as unknown as ICharacterRepository
    );
}

describe('EraseCharacterUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseCharacter.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseCharacter).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A character id is required to erase a character' });
        expect(mockRepository.eraseCharacter).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A character id is required to erase a character' });
        expect(mockRepository.eraseCharacter).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseCharacter.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseCharacter.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase character' });
    });
});

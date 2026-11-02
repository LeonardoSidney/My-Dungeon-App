import { EraseAbilityUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAbilityRepository } from '@domain/repository';

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
    eraseAbility: jest.fn()
};

function buildUseCase (): EraseAbilityUseCase {
    return new EraseAbilityUseCase(
        mockLogger,
        mockRepository as unknown as IAbilityRepository
    );
}

describe('EraseAbilityUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseAbility.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseAbility).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'An ability id is required to erase an ability' });
        expect(mockRepository.eraseAbility).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'An ability id is required to erase an ability' });
        expect(mockRepository.eraseAbility).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseAbility.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseAbility.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase ability' });
    });
});

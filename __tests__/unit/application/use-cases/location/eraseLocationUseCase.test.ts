import { EraseLocationUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { ILocationRepository } from '@domain/repository';

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
    eraseLocation: jest.fn()
};

function buildUseCase (): EraseLocationUseCase {
    return new EraseLocationUseCase(
        mockLogger,
        mockRepository as unknown as ILocationRepository
    );
}

describe('EraseLocationUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseLocation.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseLocation).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A location id is required to erase a location' });
        expect(mockRepository.eraseLocation).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A location id is required to erase a location' });
        expect(mockRepository.eraseLocation).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseLocation.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseLocation.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase location' });
    });
});

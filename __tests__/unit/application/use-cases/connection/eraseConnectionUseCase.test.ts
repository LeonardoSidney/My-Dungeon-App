import { EraseConnectionUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IConnectionRepository } from '@domain/repository';

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
    eraseConnection: jest.fn()
};

function buildUseCase (): EraseConnectionUseCase {
    return new EraseConnectionUseCase(
        mockLogger,
        mockRepository as unknown as IConnectionRepository
    );
}

describe('EraseConnectionUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseConnection.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseConnection).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A connection id is required to erase a connection' });
        expect(mockRepository.eraseConnection).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A connection id is required to erase a connection' });
        expect(mockRepository.eraseConnection).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseConnection.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseConnection.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase connection' });
    });
});

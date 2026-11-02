import { EraseAssistantUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { IAssistantRepository } from '@domain/repository';

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
    eraseAssistant: jest.fn()
};

function buildUseCase (): EraseAssistantUseCase {
    return new EraseAssistantUseCase(
        mockLogger,
        mockRepository as unknown as IAssistantRepository
    );
}

describe('EraseAssistantUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseAssistant.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseAssistant).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'An assistant id is required to erase an assistant' });
        expect(mockRepository.eraseAssistant).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'An assistant id is required to erase an assistant' });
        expect(mockRepository.eraseAssistant).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseAssistant.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseAssistant.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase assistant' });
    });
});

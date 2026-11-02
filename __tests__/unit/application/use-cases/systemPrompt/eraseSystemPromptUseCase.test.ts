import { EraseSystemPromptUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import { ISystemPromptRepository } from '@domain/repository';

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
    eraseSystemPrompt: jest.fn()
};

function buildUseCase (): EraseSystemPromptUseCase {
    return new EraseSystemPromptUseCase(
        mockLogger,
        mockRepository as unknown as ISystemPromptRepository
    );
}

describe('EraseSystemPromptUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRepository.eraseSystemPrompt.mockResolvedValue({ success: true });
    });

    it('should erase by id and return success', async () => {
        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(mockRepository.eraseSystemPrompt).toHaveBeenCalledWith('entity-1');
        expect(response).toEqual({ success: true });
    });

    it('should fail when the id is empty', async () => {
        const response = await buildUseCase().execute({ id: '' });

        expect(response).toEqual({ success: false, error: 'A system prompt id is required to erase a system prompt' });
        expect(mockRepository.eraseSystemPrompt).not.toHaveBeenCalled();
    });

    it('should fail when the id is blank', async () => {
        const response = await buildUseCase().execute({ id: '   ' });

        expect(response).toEqual({ success: false, error: 'A system prompt id is required to erase a system prompt' });
        expect(mockRepository.eraseSystemPrompt).not.toHaveBeenCalled();
    });

    it('should return the repository error', async () => {
        mockRepository.eraseSystemPrompt.mockResolvedValue({ success: false, error: 'Disk full' });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Disk full' });
    });

    it('should return a fallback error when the repository fails without one', async () => {
        mockRepository.eraseSystemPrompt.mockResolvedValue({ success: false });

        const response = await buildUseCase().execute({ id: 'entity-1' });

        expect(response).toEqual({ success: false, error: 'Failed to erase system prompt' });
    });
});

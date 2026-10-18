import { DeleteThinkAdventureController } from '@adapters/controllers';
import { IDeleteThinkAdventureUseCase, DeleteThinkAdventureUseCaseParams } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockUseCase = {
    execute: jest.fn()
};

function buildRequest (overrides: Partial<DeleteThinkAdventureUseCaseParams> = {}): DeleteThinkAdventureUseCaseParams {
    return {
        adventure: createAdventureHelper({
            chat: [createChatHelper({
                think: [
                    { id: 't0', content: 'zero', enabled: true },
                    { id: 't1', content: 'one', enabled: true }
                ],
                thinkIndex: 1
            })]
        }),
        chatId: 'chat-1',
        index: 1,
        ...overrides
    };
}

describe('DeleteThinkAdventureController', () => {
    let controller: DeleteThinkAdventureController;

    beforeEach(() => {
        controller = new DeleteThinkAdventureController(mockLogger, mockUseCase as unknown as IDeleteThinkAdventureUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('forwards the request to the use case and maps the success response', async () => {
        const request = buildRequest();
        const chat = createChatHelper({
            think: [{ id: 't0', content: 'zero', enabled: true }],
            thinkIndex: 0
        });
        const adventure = { ...request.adventure, chat: [chat] };
        mockUseCase.execute.mockResolvedValue({ success: true, chat, adventure });

        const response = await controller.handle(request);

        expect(mockUseCase.execute).toHaveBeenCalledWith(request);
        expect(response).toEqual({ success: true, chat, adventure });
        expect(mockLogger.info).toHaveBeenCalledWith('Executing DeleteThinkAdventureController::handle');
    });

    it('maps the failure response without adding fields', async () => {
        mockUseCase.execute.mockResolvedValue({ success: false, error: 'The only think version of a chat cannot be deleted' });

        const response = await controller.handle(buildRequest());

        expect(response).toEqual({ success: false, error: 'The only think version of a chat cannot be deleted' });
    });
});

import { EditThinkAdventureController } from '@adapters/controllers';
import { IEditThinkAdventureUseCase, EditThinkAdventureUseCaseParams } from '@domain/use-cases';
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

function buildRequest (overrides: Partial<EditThinkAdventureUseCaseParams> = {}): EditThinkAdventureUseCaseParams {
    return {
        adventure: createAdventureHelper({ chat: [createChatHelper()] }),
        chatId: 'chat-1',
        content: 'a refined note',
        ...overrides
    };
}

describe('EditThinkAdventureController', () => {
    let controller: EditThinkAdventureController;

    beforeEach(() => {
        controller = new EditThinkAdventureController(mockLogger, mockUseCase as unknown as IEditThinkAdventureUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('forwards the request to the use case and maps the success response', async () => {
        const request = buildRequest();
        const chat = createChatHelper({
            think: [{ id: 'think-new', content: 'a refined note', enabled: true }],
            thinkIndex: 0
        });
        const adventure = { ...request.adventure, chat: [chat] };
        mockUseCase.execute.mockResolvedValue({ success: true, chat, adventure });

        const response = await controller.handle(request);

        expect(mockUseCase.execute).toHaveBeenCalledWith(request);
        expect(response).toEqual({ success: true, chat, adventure });
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditThinkAdventureController::handle');
    });

    it('maps the failure response without adding fields', async () => {
        mockUseCase.execute.mockResolvedValue({ success: false, error: 'Chat with id chat-1 was not found' });

        const response = await controller.handle(buildRequest());

        expect(response).toEqual({ success: false, error: 'Chat with id chat-1 was not found' });
    });
});

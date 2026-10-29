import { FinishStreamingChatService } from '@application/services';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

describe('FinishStreamingChatService', () => {
    let service: FinishStreamingChatService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new FinishStreamingChatService(mockLogger);
    });

    it('marks only the streaming chat as finished', () => {
        const other = createChatHelper({ id: 'chat-0' });
        const streaming = createChatHelper({ id: 'chat-1', content: ['partial answer'], isStreaming: true });
        const adventure = createAdventureHelper({ chat: [other, streaming] });

        const result = service.finishStreamingChat({ adventure, chatId: 'chat-1' });

        expect(result.success).toBe(true);
        expect(result.chat).toEqual(expect.objectContaining({ id: 'chat-1', content: ['partial answer'], isStreaming: false }));
        expect(result.adventure?.chat[0]).toBe(other);
        expect(result.adventure?.chat[1]).toBe(result.chat);
        expect(result.adventure?.updatedAt).toBe(result.chat?.updatedAt);
    });

    it('returns an error when the chat was not found', () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        const result = service.finishStreamingChat({ adventure, chatId: 'missing' });

        expect(result).toEqual({ success: false, error: 'Chat not found in adventure' });
        expect(mockLogger.warning).toHaveBeenCalled();
    });
});

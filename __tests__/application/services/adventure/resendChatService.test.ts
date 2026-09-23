import { ResendChatService } from '@application/services';
import {
    ResendChatServiceParams,
    ResendChatServiceReturn
} from '@domain/services';
import { ILogger } from '@domain/logger';
import { RoleEnum } from '@domain/entities';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function buildParams (overrides: Partial<ResendChatServiceParams> = {}): ResendChatServiceParams {
    const adventure = createAdventureHelper({
        chat: [
            createChatHelper({ id: 'chat-1', role: RoleEnum.USER }),
            createChatHelper({ id: 'chat-2', role: RoleEnum.ASSISTANT })
        ]
    });

    return {
        adventure,
        chatId: 'chat-2',
        ...overrides
    };
}

describe('ResendChatService', () => {
    let service: ResendChatService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new ResendChatService(mockLogger);
    });

    it('removes the target chat and keeps the rest', () => {
        const result: ResendChatServiceReturn = service.resendChat(buildParams());

        expect(result.success).toBe(true);
        expect(result.adventure?.chat).toHaveLength(1);
        expect(result.adventure?.chat[0].id).toBe('chat-1');
    });

    it('removes a middle chat and keeps the remaining ones in order', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'chat-1' }),
                createChatHelper({ id: 'chat-2' }),
                createChatHelper({ id: 'chat-3' })
            ]
        });

        const result: ResendChatServiceReturn = service.resendChat(buildParams({ adventure, chatId: 'chat-2' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['chat-1', 'chat-3']);
    });

    it('returns an error when the chat was not found', () => {
        const result: ResendChatServiceReturn = service.resendChat(buildParams({ chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('missing');
    });
});

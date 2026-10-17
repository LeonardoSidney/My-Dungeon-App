import { ContinueFromChatService } from '@application/services';
import {
    ContinueFromChatServiceParams,
    ContinueFromChatServiceReturn
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

function buildParams (overrides: Partial<ContinueFromChatServiceParams> = {}): ContinueFromChatServiceParams {
    const adventure = createAdventureHelper({
        chat: [
            createChatHelper({ id: 'chat-1', role: RoleEnum.USER }),
            createChatHelper({ id: 'chat-2', role: RoleEnum.ASSISTANT }),
            createChatHelper({ id: 'chat-3', role: RoleEnum.USER })
        ]
    });

    return {
        adventure,
        chatId: 'chat-2',
        ...overrides
    };
}

describe('ContinueFromChatService', () => {
    let service: ContinueFromChatService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new ContinueFromChatService(mockLogger);
    });

    it('truncates the history keeping the target chat', () => {
        const result: ContinueFromChatServiceReturn = service.continueFromChat(buildParams());

        expect(result.success).toBe(true);
        expect(result.adventure?.chat).toHaveLength(2);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['chat-1', 'chat-2']);
    });

    it('keeps the full history when the target is the last chat', () => {
        const result: ContinueFromChatServiceReturn = service.continueFromChat(buildParams({ chatId: 'chat-3' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat).toHaveLength(3);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['chat-1', 'chat-2', 'chat-3']);
    });

    it('keeps only the target when it is the first chat', () => {
        const result: ContinueFromChatServiceReturn = service.continueFromChat(buildParams({ chatId: 'chat-1' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat).toHaveLength(1);
        expect(result.adventure?.chat[0].id).toBe('chat-1');
    });

    it('returns an error when the chat was not found', () => {
        const result: ContinueFromChatServiceReturn = service.continueFromChat(buildParams({ chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('missing');
    });
});

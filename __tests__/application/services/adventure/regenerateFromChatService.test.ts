import { RegenerateFromChatService } from '@application/services';
import {
    RegenerateFromChatServiceParams,
    RegenerateFromChatServiceReturn
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

function buildParams (overrides: Partial<RegenerateFromChatServiceParams> = {}): RegenerateFromChatServiceParams {
    const adventure = createAdventureHelper({
        chat: [
            createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
            createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT }),
            createChatHelper({ id: 'user-2', role: RoleEnum.USER }),
            createChatHelper({ id: 'assistant-2', role: RoleEnum.ASSISTANT })
        ]
    });

    return {
        adventure,
        chatId: 'assistant-2',
        ...overrides
    };
}

describe('RegenerateFromChatService', () => {
    let service: RegenerateFromChatService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new RegenerateFromChatService(mockLogger);
    });

    it('truncates the history after the last user message before the target', () => {
        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams());

        expect(result.success).toBe(true);
        expect(result.adventure?.chat).toHaveLength(3);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-1', 'user-2']);
    });

    it('truncates after the user message when the target is an assistant chat', () => {
        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ chatId: 'assistant-1' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat).toHaveLength(1);
        expect(result.adventure?.chat[0].id).toBe('user-1');
    });

    it('keeps only the target when the target itself is the last user message', () => {
        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ chatId: 'user-2' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat).toHaveLength(3);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-1', 'user-2']);
    });

    it('returns an error when no user message exists before the target', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT }),
                createChatHelper({ id: 'assistant-2', role: RoleEnum.ASSISTANT })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'assistant-2' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('No user message found before chat assistant-2');
    });

    it('returns an error when the chat was not found', () => {
        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('missing');
    });
});

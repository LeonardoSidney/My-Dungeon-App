import { DeleteChatAdventureService } from '@application/services';
import { RoleEnum } from '@domain/entities';
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

describe('DeleteChatAdventureService', () => {
    const service = new DeleteChatAdventureService(mockLogger);

    it('removes the whole chat even when it has several versions', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT, content: ['v0', 'v1'] })
            ]
        });

        const result = service.deleteChat({ adventure, chatId: 'assistant-1' });

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1']);
    });

    it('removes every chat after the deleted chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'user-2', role: RoleEnum.USER }),
                createChatHelper({ id: 'persona-1', role: RoleEnum.AI_PERSONA }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT })
            ]
        });

        const result = service.deleteChat({ adventure, chatId: 'user-2' });

        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1']);
    });

    it('keeps every chat before the deleted chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'persona-1', role: RoleEnum.AI_PERSONA }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT })
            ]
        });

        const result = service.deleteChat({ adventure, chatId: 'assistant-1' });

        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'persona-1']);
    });

    it('returns an error when the chat was not found', () => {
        const result = service.deleteChat({ adventure: createAdventureHelper({ chat: [createChatHelper()] }), chatId: 'missing' });

        expect(result.success).toBe(false);
        expect(result.error).toContain('missing');
    });
});

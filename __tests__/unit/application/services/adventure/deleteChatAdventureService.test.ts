import { DeleteChatAdventureService } from '@application/services';
import { RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
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
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT, content: ['v0', 'v1'] }),
                createChatHelper({ id: 'user-2', role: RoleEnum.USER })
            ]
        });

        const result = service.deleteChat({ adventure, chatId: 'assistant-1' });

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-2']);
    });

    it('also removes the assistant chat that answers a deleted user chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT })
            ]
        });

        const result = service.deleteChat({ adventure, chatId: 'user-1' });

        expect(result.adventure?.chat).toEqual([]);
    });

    it('keeps the following chat when it is not an assistant chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'user-2', role: RoleEnum.USER })
            ]
        });

        const result = service.deleteChat({ adventure, chatId: 'user-1' });

        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-2']);
    });

    it('does not cascade when deleting an assistant chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT })
            ]
        });

        const result = service.deleteChat({ adventure, chatId: 'assistant-1' });

        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1']);
    });

    it('returns an error when the chat was not found', () => {
        const result = service.deleteChat({ adventure: createAdventureHelper({ chat: [createChatHelper()] }), chatId: 'missing' });

        expect(result.success).toBe(false);
        expect(result.error).toContain('missing');
    });
});

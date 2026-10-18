import { DeleteChatAdventureService } from '@application/services';
import {
    DeleteChatAdventureServiceParams,
    DeleteChatAdventureServiceReturn
} from '@domain/services';
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

function buildParams (overrides: Partial<DeleteChatAdventureServiceParams> = {}): DeleteChatAdventureServiceParams {
    const adventure = createAdventureHelper({ chat: [createChatHelper()] });
    return {
        adventure,
        chatId: 'chat-1',
        index: 0,
        ...overrides
    };
}

describe('DeleteChatAdventureService', () => {
    let service: DeleteChatAdventureService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new DeleteChatAdventureService(mockLogger);
    });

    it('deletes a middle entry and reveals the previous version', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ content: ['M0', 'M1', 'M2', 'M3', 'M4'], index: 3 })]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, index: 3 }));

        expect(result.success).toBe(true);
        expect(result.chat?.content).toEqual(['M0', 'M1', 'M2', 'M4']);
        expect(result.chat?.index).toBe(2);
        expect(result.chat?.thinkIndex).toBe(0);
        expect(result.adventure?.chat[0].content).toEqual(['M0', 'M1', 'M2', 'M4']);
    });

    it('deleting the last entry lands on the new last version', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ content: ['v0', 'v1', 'v2'], index: 2 })]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, index: 2 }));

        expect(result.success).toBe(true);
        expect(result.chat?.content).toEqual(['v0', 'v1']);
        expect(result.chat?.index).toBe(1);
    });

    it('deleting the first entry keeps the first remaining version', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ content: ['v0', 'v1', 'v2'], index: 0 })]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, index: 0 }));

        expect(result.success).toBe(true);
        expect(result.chat?.content).toEqual(['v1', 'v2']);
        expect(result.chat?.index).toBe(0);
    });

    it('deleting the only entry removes the whole chat', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ content: ['only'], index: 0 }), createChatHelper({ id: 'other', content: ['keep'] })]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, index: 0 }));

        expect(result.success).toBe(true);
        expect(result.chat).toBeUndefined();
        expect(result.adventure?.chat).toHaveLength(1);
        expect(result.adventure?.chat[0].id).toBe('other');
    });

    it('clamps an out of bounds index to the last entry', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ content: ['v0', 'v1'], index: 1 })]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, index: 99 }));

        expect(result.success).toBe(true);
        expect(result.chat?.content).toEqual(['v0']);
        expect(result.chat?.index).toBe(0);
    });

    it('deleting the last version of a user chat also removes the following assistant chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER, content: ['v0'] }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT, content: ['answer'] })
            ]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, chatId: 'user-1' }));

        expect(result.success).toBe(true);
        expect(result.chat).toBeUndefined();
        expect(result.adventure?.chat).toEqual([]);
    });

    it('keeps the following chat when it is not an assistant chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER, content: ['v0'] }),
                createChatHelper({ id: 'user-2', role: RoleEnum.USER, content: ['v0'] })
            ]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, chatId: 'user-1' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-2']);
    });

    it('does not cascade when deleting an assistant chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER, content: ['v0'] }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT, content: ['answer'] })
            ]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, chatId: 'assistant-1' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1']);
    });

    it('keeps the following assistant chat when only a version of the user chat is deleted', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER, content: ['v0', 'v1'], index: 0 }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT, content: ['answer'] })
            ]
        });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, chatId: 'user-1' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-1']);
        expect(result.chat?.content).toEqual(['v1']);
        expect(result.chat?.index).toBe(0);
    });

    it('returns an error when the chat was not found', () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        const result: DeleteChatAdventureServiceReturn = service.deleteChat(buildParams({ adventure, chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.error).toContain('missing');
    });
});

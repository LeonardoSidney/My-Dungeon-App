import { EditChatAdventureService } from '@application/services';
import {
    EditChatAdventureServiceParams,
    EditChatAdventureServiceReturn
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

function buildParams (overrides: Partial<EditChatAdventureServiceParams> = {}): EditChatAdventureServiceParams {
    const adventure = createAdventureHelper({ chat: [createChatHelper()] });
    return {
        adventure,
        chatId: 'chat-1',
        content: 'new version',
        role: RoleEnum.USER,
        characterId: 'character-1',
        ...overrides
    };
}

describe('EditChatAdventureService', () => {
    let service: EditChatAdventureService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new EditChatAdventureService(mockLogger);
    });

    it('appends a new version and points index to it, preserving previous entries', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ content: ['v0', 'v1'], index: 1 })]
        });

        const result: EditChatAdventureServiceReturn = service.editChat(buildParams({ adventure, content: 'v2' }));

        expect(result.success).toBe(true);
        expect(result.chat?.content).toEqual(['v0', 'v1', 'v2']);
        expect(result.chat?.index).toBe(2);
        expect(result.adventure?.chat[0].content).toEqual(['v0', 'v1', 'v2']);
    });

    it('appends to a single-entry chat, enabling navigation', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ content: ['only'], index: 0 })]
        });

        const result: EditChatAdventureServiceReturn = service.editChat(buildParams({ adventure, content: 'second' }));

        expect(result.success).toBe(true);
        expect(result.chat?.content).toEqual(['only', 'second']);
        expect(result.chat?.index).toBe(1);
    });

    it('keeps the same chat id across versions', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'stable-id', content: ['a'], index: 0 })]
        });

        const result: EditChatAdventureServiceReturn = service.editChat(buildParams({ adventure, chatId: 'stable-id', content: 'b' }));

        expect(result.chat?.id).toBe('stable-id');
        expect(result.adventure?.chat[0].id).toBe('stable-id');
    });

    it('returns an error when the chat is not found', () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper({ id: 'other' })] });

        const result: EditChatAdventureServiceReturn = service.editChat(buildParams({ adventure, chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
    });
});

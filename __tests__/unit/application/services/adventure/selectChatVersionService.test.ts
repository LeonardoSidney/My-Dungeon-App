import { SelectChatVersionService } from '@application/services';
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

const thinks = [
    { id: 't0', content: 'zero', enabled: true },
    { id: 't1', content: 'one', enabled: true }
];

function buildAdventure () {
    return createAdventureHelper({
        chat: [
            createChatHelper({ id: 'chat-0' }),
            createChatHelper({ id: 'chat-1', content: ['a', 'b'], index: 0, think: thinks, thinkIndex: 0 })
        ]
    });
}

describe('SelectChatVersionService', () => {
    let service: SelectChatVersionService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new SelectChatVersionService(mockLogger);
    });

    it('selects the content version without touching the think index or the other chats', () => {
        const adventure = buildAdventure();

        const result = service.selectVersion({ adventure, chatId: 'chat-1', kind: 'content', index: 1 });

        expect(result.success).toBe(true);
        expect(result.chat).toEqual(expect.objectContaining({ index: 1, thinkIndex: 0 }));
        expect(result.adventure?.chat[0]).toBe(adventure.chat[0]);
        expect(result.adventure?.chat[1]).toBe(result.chat);
    });

    it('selects the think version without touching the content index', () => {
        const result = service.selectVersion({ adventure: buildAdventure(), chatId: 'chat-1', kind: 'think', index: 1 });

        expect(result.chat).toEqual(expect.objectContaining({ index: 0, thinkIndex: 1 }));
    });

    it('returns an error when the chat was not found', () => {
        const result = service.selectVersion({ adventure: buildAdventure(), chatId: 'missing', kind: 'content', index: 0 });

        expect(result).toEqual({ success: false, error: 'Chat with id missing was not found' });
    });

    it.each([
        ['content', -1],
        ['content', 2],
        ['think', 2]
    ] as const)('rejects the %s version index %p as out of bounds', (kind, index) => {
        const result = service.selectVersion({ adventure: buildAdventure(), chatId: 'chat-1', kind, index });

        expect(result).toEqual({ success: false, error: `Version index ${index} is out of bounds` });
    });

    it('rejects any think version of a chat without thinks', () => {
        const result = service.selectVersion({ adventure: buildAdventure(), chatId: 'chat-0', kind: 'think', index: 0 });

        expect(result).toEqual({ success: false, error: 'Version index 0 is out of bounds' });
    });
});

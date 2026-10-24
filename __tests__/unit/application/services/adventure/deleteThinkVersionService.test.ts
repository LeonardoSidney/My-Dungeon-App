import { DeleteThinkVersionService } from '@application/services';
import {
    DeleteThinkVersionServiceParams,
    DeleteThinkVersionServiceReturn
} from '@domain/services';
import { ILogger } from '@domain/logger';
import { Think } from '@domain/entities';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const thinks: Think[] = [
    { id: 't0', content: 'zero', enabled: true },
    { id: 't1', content: 'one', enabled: true },
    { id: 't2', content: 'two', enabled: true }
];

function buildParams (overrides: Partial<DeleteThinkVersionServiceParams> = {}): DeleteThinkVersionServiceParams {
    const adventure = createAdventureHelper({
        chat: [createChatHelper({ think: thinks, thinkIndex: 1 })]
    });

    return {
        adventure,
        chatId: 'chat-1',
        versionIndex: 1,
        ...overrides
    };
}

describe('DeleteThinkVersionService', () => {
    let service: DeleteThinkVersionService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new DeleteThinkVersionService(mockLogger);
    });

    it('deletes a middle version and reveals the previous one', () => {
        const result: DeleteThinkVersionServiceReturn = service.deleteThink(buildParams());

        expect(result.success).toBe(true);
        expect(result.adventure?.chat[0].think).toEqual([thinks[0], thinks[2]]);
        expect(result.adventure?.chat[0].thinkIndex).toBe(0);
        expect(result.adventure?.chat[0].content).toEqual(['original message']);
        expect(result.adventure?.chat[0].think).toEqual([thinks[0], thinks[2]]);
    });

    it('deleting the last version lands on the previous one', () => {
        const result: DeleteThinkVersionServiceReturn = service.deleteThink(buildParams({ versionIndex: 2 }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat[0].think).toEqual([thinks[0], thinks[1]]);
        expect(result.adventure?.chat[0].thinkIndex).toBe(1);
    });

    it('rejects an out of bounds version index instead of guessing', () => {
        const result: DeleteThinkVersionServiceReturn = service.deleteThink(buildParams({ versionIndex: 99 }));

        expect(result).toEqual({ success: false, error: 'Think version index 99 is out of bounds' });
    });

    it('refuses to delete the only think version', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({
                think: [{ id: 't0', content: 'only', enabled: true }],
                thinkIndex: 0
            })]
        });

        const result: DeleteThinkVersionServiceReturn = service.deleteThink(buildParams({ adventure, versionIndex: 0 }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('only one think version');
    });

    it('returns an error when the chat has no think versions', () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        const result: DeleteThinkVersionServiceReturn = service.deleteThink(buildParams({ adventure, versionIndex: 0 }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('has no think versions to delete');
    });

    it('returns an error when the chat was not found', () => {
        const result: DeleteThinkVersionServiceReturn = service.deleteThink(buildParams({ chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('Chat with id missing was not found');
    });

    it('keeps the other chats of the adventure untouched', () => {
        const other = createChatHelper({ id: 'chat-0' });
        const adventure = createAdventureHelper({
            chat: [other, createChatHelper({ think: thinks, thinkIndex: 1 })]
        });

        const result: DeleteThinkVersionServiceReturn = service.deleteThink(buildParams({ adventure }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat[0]).toBe(other);
        expect(result.adventure?.chat[1].think).toEqual([thinks[0], thinks[2]]);
    });
});

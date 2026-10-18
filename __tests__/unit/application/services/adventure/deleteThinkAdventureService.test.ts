import { DeleteThinkAdventureService } from '@application/services';
import {
    DeleteThinkAdventureServiceParams,
    DeleteThinkAdventureServiceReturn
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

function buildParams (overrides: Partial<DeleteThinkAdventureServiceParams> = {}): DeleteThinkAdventureServiceParams {
    const adventure = createAdventureHelper({
        chat: [createChatHelper({ think: thinks, thinkIndex: 1 })]
    });

    return {
        adventure,
        chatId: 'chat-1',
        index: 1,
        ...overrides
    };
}

describe('DeleteThinkAdventureService', () => {
    let service: DeleteThinkAdventureService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new DeleteThinkAdventureService(mockLogger);
    });

    it('deletes a middle version and reveals the previous one', () => {
        const result: DeleteThinkAdventureServiceReturn = service.deleteThink(buildParams());

        expect(result.success).toBe(true);
        expect(result.chat?.think).toEqual([thinks[0], thinks[2]]);
        expect(result.chat?.thinkIndex).toBe(0);
        expect(result.chat?.content).toEqual(['original message']);
        expect(result.adventure?.chat[0].think).toEqual([thinks[0], thinks[2]]);
    });

    it('deleting the last version lands on the previous one', () => {
        const result: DeleteThinkAdventureServiceReturn = service.deleteThink(buildParams({ index: 2 }));

        expect(result.success).toBe(true);
        expect(result.chat?.think).toEqual([thinks[0], thinks[1]]);
        expect(result.chat?.thinkIndex).toBe(1);
    });

    it('clamps an out of bounds index to the last version', () => {
        const result: DeleteThinkAdventureServiceReturn = service.deleteThink(buildParams({ index: 99 }));

        expect(result.success).toBe(true);
        expect(result.chat?.think).toEqual([thinks[0], thinks[1]]);
        expect(result.chat?.thinkIndex).toBe(1);
    });

    it('refuses to delete the only think version', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({
                think: [{ id: 't0', content: 'only', enabled: true }],
                thinkIndex: 0
            })]
        });

        const result: DeleteThinkAdventureServiceReturn = service.deleteThink(buildParams({ adventure, index: 0 }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('only one think version');
    });

    it('returns an error when the chat has no think versions', () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        const result: DeleteThinkAdventureServiceReturn = service.deleteThink(buildParams({ adventure, index: 0 }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('has no think versions to delete');
    });

    it('returns an error when the chat was not found', () => {
        const result: DeleteThinkAdventureServiceReturn = service.deleteThink(buildParams({ chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('Chat with id missing was not found');
    });
});

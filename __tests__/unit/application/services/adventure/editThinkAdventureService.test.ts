import { EditThinkAdventureService } from '@application/services';
import {
    EditThinkAdventureServiceParams,
    EditThinkAdventureServiceReturn
} from '@domain/services';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockIdGenerator: IIdGenerator = {
    generate: jest.fn().mockReturnValue('think-new')
};

function buildParams (overrides: Partial<EditThinkAdventureServiceParams> = {}): EditThinkAdventureServiceParams {
    const adventure = createAdventureHelper({ chat: [createChatHelper()] });

    return {
        adventure,
        chatId: 'chat-1',
        content: 'a refined note',
        ...overrides
    };
}

describe('EditThinkAdventureService', () => {
    let service: EditThinkAdventureService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new EditThinkAdventureService(mockLogger, mockIdGenerator);
    });

    it('appends a new think version and points thinkIndex to it', () => {
        const result: EditThinkAdventureServiceReturn = service.editThink(buildParams());

        expect(result.success).toBe(true);
        expect(result.chat?.think).toEqual([{ id: 'think-new', content: 'a refined note', enabled: true }]);
        expect(result.chat?.thinkIndex).toBe(0);
        expect(result.chat?.content).toEqual(['original message']);
        expect(result.chat?.index).toBe(0);
        expect(result.adventure?.chat[0].think).toEqual([{ id: 'think-new', content: 'a refined note', enabled: true }]);
    });

    it('appends after the existing think versions', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({
                think: [{ id: 'think-0', content: 'old note', enabled: true }],
                thinkIndex: 0
            })]
        });

        const result: EditThinkAdventureServiceReturn = service.editThink(buildParams({ adventure }));

        expect(result.success).toBe(true);
        expect(result.chat?.think).toHaveLength(2);
        expect(result.chat?.think?.[1]).toEqual({ id: 'think-new', content: 'a refined note', enabled: true });
        expect(result.chat?.thinkIndex).toBe(1);
    });

    it('returns an error when the chat was not found', () => {
        const result: EditThinkAdventureServiceReturn = service.editThink(buildParams({ chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('Chat with id missing was not found');
    });
});

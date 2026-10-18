import { UpdateStreamingChatService } from '@application/services';
import {
    UpdateStreamingChatServiceParams,
    UpdateStreamingChatServiceReturn
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

const firstThink: Think = { id: 'think-0', content: 'first note', enabled: true };
const secondThink: Think = { id: 'think-1', content: 'second note', enabled: true };

function buildParams (overrides: Partial<UpdateStreamingChatServiceParams> = {}): UpdateStreamingChatServiceParams {
    const adventure = createAdventureHelper({
        chat: [createChatHelper({
            content: ['v0', 'v1'],
            index: 1,
            think: [firstThink, secondThink],
            thinkIndex: 0
        })]
    });

    return {
        adventure,
        chatId: 'chat-1',
        content: 'v1 updated',
        ...overrides
    };
}

describe('UpdateStreamingChatService', () => {
    let service: UpdateStreamingChatService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new UpdateStreamingChatService(mockLogger);
    });

    it('replaces the content at the current index without touching the thinks', () => {
        const result: UpdateStreamingChatServiceReturn = service.updateStreamingChat(buildParams());

        expect(result.success).toBe(true);
        expect(result.chat?.content).toEqual(['v0', 'v1 updated']);
        expect(result.chat?.think).toEqual([firstThink, secondThink]);
        expect(result.chat?.thinkIndex).toBe(0);
        expect(result.adventure?.chat[0].content).toEqual(['v0', 'v1 updated']);
    });

    it('updates the think version matching the incoming think id in place', () => {
        const result: UpdateStreamingChatServiceReturn = service.updateStreamingChat(buildParams({
            think: { ...secondThink, content: 'second note refined' }
        }));

        expect(result.success).toBe(true);
        expect(result.chat?.think).toEqual([
            firstThink,
            { ...secondThink, content: 'second note refined' }
        ]);
        expect(result.chat?.thinkIndex).toBe(1);
    });

    it('appends a new think version when the incoming think id is unknown', () => {
        const result: UpdateStreamingChatServiceReturn = service.updateStreamingChat(buildParams({
            think: { id: 'think-new', content: 'streaming note', enabled: true }
        }));

        expect(result.success).toBe(true);
        expect(result.chat?.think).toHaveLength(3);
        expect(result.chat?.think?.[2]).toEqual({ id: 'think-new', content: 'streaming note', enabled: true });
        expect(result.chat?.thinkIndex).toBe(2);
    });

    it('returns an error when the chat was not found', () => {
        const result: UpdateStreamingChatServiceReturn = service.updateStreamingChat(buildParams({ chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('Chat not found');
    });
});

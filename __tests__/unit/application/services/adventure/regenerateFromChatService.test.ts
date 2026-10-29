import { RegenerateFromChatService } from '@application/services';
import {
    RegenerateFromChatServiceParams,
    RegenerateFromChatServiceReturn
} from '@domain/services';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { RoleEnum } from '@domain/entities';
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

const mockIdGenerator: IIdGenerator = {
    generate: jest.fn().mockReturnValue('think-id')
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
        service = new RegenerateFromChatService(mockLogger, mockIdGenerator);
    });

    it('appends a fresh think and content slot when the target is an assistant chat', () => {
        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ chatId: 'assistant-2' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-1', 'user-2', 'assistant-2']);
        expect(result.chat?.id).toBe('assistant-2');
        expect(result.chat?.content).toEqual(['original message', '']);
        expect(result.chat?.index).toBe(1);
        expect(result.chat?.think).toEqual([{ id: 'think-id', content: undefined, enabled: false }]);
        expect(result.chat?.thinkIndex).toBe(0);
        expect(result.chat?.isStreaming).toBe(false);
    });

    it('appends after the existing thinks when the target is an assistant chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({
                    id: 'assistant-2',
                    role: RoleEnum.ASSISTANT,
                    think: [{ id: 'think-existing', content: 'old note', enabled: true }],
                    thinkIndex: 0
                })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'assistant-2' }));

        expect(result.success).toBe(true);
        expect(result.chat?.think).toHaveLength(2);
        expect(result.chat?.think?.[1]).toEqual({ id: 'think-id', content: undefined, enabled: false });
        expect(result.chat?.thinkIndex).toBe(1);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-2']);
    });

    it('keeps the following assistant with a fresh empty content slot when the target is a user chat', () => {
        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ chatId: 'user-1' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-1']);
        expect(result.chat?.id).toBe('assistant-1');
        expect(result.chat?.content).toEqual(['original message', '']);
        expect(result.chat?.index).toBe(1);
        expect(result.chat?.think).toEqual([{ id: 'think-id', content: undefined, enabled: false }]);
        expect(result.chat?.thinkIndex).toBe(0);
        expect(result.chat?.isStreaming).toBe(false);
    });

    it('keeps the existing thinks as navigable versions when the target is a user chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({
                    id: 'assistant-1',
                    role: RoleEnum.ASSISTANT,
                    think: [{ id: 'think-existing', content: 'old note', enabled: true }],
                    thinkIndex: 0
                })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'user-1' }));

        expect(result.success).toBe(true);
        expect(result.chat?.id).toBe('assistant-1');
        expect(result.chat?.think).toHaveLength(2);
        expect(result.chat?.think?.[0]).toEqual({ id: 'think-existing', content: 'old note', enabled: true });
        expect(result.chat?.think?.[1]).toEqual({ id: 'think-id', content: undefined, enabled: false });
        expect(result.chat?.thinkIndex).toBe(1);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-1']);
    });

    it('reuses the existing empty think instead of appending when the target is a user chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({
                    id: 'assistant-1',
                    role: RoleEnum.ASSISTANT,
                    think: [{ id: 'think-empty', content: undefined, enabled: false }],
                    thinkIndex: 0
                })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'user-1' }));

        expect(result.success).toBe(true);
        expect(result.chat?.id).toBe('assistant-1');
        expect(result.chat?.think).toHaveLength(1);
        expect(result.chat?.think?.[0]).toEqual({ id: 'think-empty', content: undefined, enabled: false });
        expect(result.chat?.thinkIndex).toBe(0);
        expect(result.chat?.content).toEqual(['original message', '']);
        expect(mockIdGenerator.generate).not.toHaveBeenCalled();
    });

    it('reuses the last empty think when several empty thinks exist when the target is a user chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({
                    id: 'assistant-1',
                    role: RoleEnum.ASSISTANT,
                    think: [
                        { id: 'think-1', content: 'old note', enabled: true },
                        { id: 'think-2', content: undefined, enabled: false },
                        { id: 'think-3', content: '', enabled: true }
                    ],
                    thinkIndex: 1
                })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'user-1' }));

        expect(result.success).toBe(true);
        expect(result.chat?.think).toHaveLength(3);
        expect(result.chat?.thinkIndex).toBe(2);
        expect(mockIdGenerator.generate).not.toHaveBeenCalled();
    });

    it('reuses the existing empty think instead of appending when the target is an assistant chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({
                    id: 'assistant-1',
                    role: RoleEnum.ASSISTANT,
                    think: [
                        { id: 'think-1', content: 'old note', enabled: true },
                        { id: 'think-empty', content: '', enabled: true }
                    ],
                    thinkIndex: 1
                })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'assistant-1' }));

        expect(result.success).toBe(true);
        expect(result.chat?.id).toBe('assistant-1');
        expect(result.chat?.think).toHaveLength(2);
        expect(result.chat?.thinkIndex).toBe(1);
        expect(result.chat?.content).toEqual(['original message', '']);
        expect(mockIdGenerator.generate).not.toHaveBeenCalled();
    });

    it('truncates the history after the target user chat when no assistant follows', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT }),
                createChatHelper({ id: 'user-2', role: RoleEnum.USER })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'user-2' }));

        expect(result.success).toBe(true);
        expect(result.chat).toBeUndefined();
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'assistant-1', 'user-2']);
    });

    it('appends a fresh think and content slot when the target is an AI persona chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'persona-1', role: RoleEnum.AI_PERSONA }),
                createChatHelper({ id: 'persona-2', role: RoleEnum.AI_PERSONA })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'persona-1' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'persona-1']);
        expect(result.chat?.id).toBe('persona-1');
        expect(result.chat?.content).toEqual(['original message', '']);
        expect(result.chat?.index).toBe(1);
    });

    it('keeps the following AI persona chat with a fresh empty content slot when the target is a user chat', () => {
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                createChatHelper({ id: 'user-2', role: RoleEnum.USER }),
                createChatHelper({ id: 'persona-1', role: RoleEnum.AI_PERSONA }),
                createChatHelper({ id: 'assistant-1', role: RoleEnum.ASSISTANT })
            ]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'user-1' }));

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.map(c => c.id)).toEqual(['user-1', 'user-2', 'persona-1']);
        expect(result.chat?.id).toBe('persona-1');
        expect(result.chat?.content).toEqual(['original message', '']);
    });

    it('returns an error when the target chat has an unsupported role', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'system-1', role: RoleEnum.SYSTEM })]
        });

        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'system-1' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('system-1');
    });

    it('returns an error when the chat was not found', () => {
        const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ chatId: 'missing' }));

        expect(result.success).toBe(false);
        expect(result.adventure).toBeUndefined();
        expect(result.error).toContain('missing');
    });

    describe('content scope', () => {
        it('appends a new content version preserving the selected think', () => {
            const adventure = createAdventureHelper({
                chat: [
                    createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                    createChatHelper({
                        id: 'assistant-1',
                        role: RoleEnum.ASSISTANT,
                        think: [
                            { id: 'think-1', content: 'first note', enabled: true },
                            { id: 'think-2', content: 'second note', enabled: false }
                        ],
                        thinkIndex: 1
                    })
                ]
            });

            const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'assistant-1', scope: 'content' }));

            expect(result.success).toBe(true);
            expect(result.chat?.id).toBe('assistant-1');
            expect(result.chat?.content).toEqual(['original message', '']);
            expect(result.chat?.index).toBe(1);
            expect(result.chat?.think).toEqual([
                { id: 'think-1', content: 'first note', enabled: true },
                { id: 'think-2', content: 'second note', enabled: false }
            ]);
            expect(result.chat?.thinkIndex).toBe(1);
            expect(result.chat?.isStreaming).toBe(false);
            expect(mockIdGenerator.generate).not.toHaveBeenCalled();
        });

        it('appends a new content version when the target is an AI persona chat', () => {
            const adventure = createAdventureHelper({
                chat: [
                    createChatHelper({ id: 'user-1', role: RoleEnum.USER }),
                    createChatHelper({ id: 'persona-1', role: RoleEnum.AI_PERSONA })
                ]
            });

            const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'persona-1', scope: 'content' }));

            expect(result.success).toBe(true);
            expect(result.chat?.id).toBe('persona-1');
            expect(result.chat?.content).toEqual(['original message', '']);
        });

        it('refuses content regeneration when the target is a user chat', () => {
            const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ chatId: 'user-1', scope: 'content' }));

            expect(result.success).toBe(false);
            expect(result.adventure).toBeUndefined();
            expect(result.error).toContain('user-1');
        });

        it('refuses content regeneration when the target has an unsupported role', () => {
            const adventure = createAdventureHelper({
                chat: [createChatHelper({ id: 'system-1', role: RoleEnum.SYSTEM })]
            });

            const result: RegenerateFromChatServiceReturn = service.regenerateFromChat(buildParams({ adventure, chatId: 'system-1', scope: 'content' }));

            expect(result.success).toBe(false);
            expect(result.adventure).toBeUndefined();
            expect(result.error).toContain('system-1');
        });
    });
});

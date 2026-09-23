import { Chat, RoleEnum } from '@domain/entities';

export function createChatHelper (overrides?: Partial<Chat>): Chat {
    const now = new Date('2026-01-01T00:00:00.000Z');

    return {
        id: 'chat-1',
        role: RoleEnum.USER,
        index: 0,
        content: ['original message'],
        characterId: 'character-1',
        createdAt: now,
        updatedAt: now,
        ...overrides
    };
}

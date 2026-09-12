import { Adventure } from '@domain/entities';

export function createAdventureHelper (overrides?: Partial<Adventure>): Adventure {
    const now = new Date('2026-01-01T00:00:00.000Z');

    return {
        id: 'adventure-1',
        name: 'Test Adventure',
        chat: [],
        characterIds: [],
        charactersControlledByAi: [],
        systemPromptIds: [],
        worldIds: [],
        locationIds: [],
        itemIds: [],
        createdAt: now,
        updatedAt: now,
        ...overrides
    };
}

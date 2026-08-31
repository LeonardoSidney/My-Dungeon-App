import { Character } from '@domain/entities';

export function createCharacterHelper (overrides?: Partial<Character>): Character {
    return {
        id: '1',
        name: 'Test Character',
        activationWord: 'activate',
        prompt: 'Character prompt',
        observation: 'Test observation',
        abilityIds: [],
        proficiencyIds: [],
        statusIds: [],
        attributes: [],
        assistantId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}

import { Character } from '@domain/entities';
import { createAssistantHelper } from './createAssistantHelper';

export function createCharacterHelper (overrides?: Partial<Character>): Character {
    return {
        id: '1',
        name: 'Test Character',
        activationWord: 'activate',
        prompt: 'Character prompt',
        observation: 'Test observation',
        assistant: createAssistantHelper(),
        worldMaster: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...overrides
    };
}

import { CreateAdventureRequest } from '@domain/controllers';

export function createAdventureRequestHelper (overrides?: Partial<CreateAdventureRequest>): CreateAdventureRequest {
    return {
        name: 'Test Adventure',
        systemPromptIds: ['1'],
        playableCharacterIds: ['1'],
        aiControlledCharacterIds: [],
        worldMasterId: '1',
        worldIds: ['1'],
        locationIds: ['1'],
        itemIds: ['1'],
        ...overrides
    };
}

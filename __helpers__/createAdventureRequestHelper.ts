import { CreateAdventureRequest } from '@domain/controllers';

export function createAdventureRequestHelper (overrides?: Partial<CreateAdventureRequest>): CreateAdventureRequest {
    return {
        name: 'Test Adventure',
        systemPromptIds: ['1'],
        characterIds: ['1'],
        worldMasterId: '1',
        charactersControlledByAi: [],
        worldIds: ['1'],
        locationIds: ['1'],
        itemIds: ['1'],
        ...overrides
    };
}

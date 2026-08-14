import { CreateAdventureRequest } from '@domain/controllers';
import { createCharacterHelper } from './createCharacterHelper';
import { createSystemPromptHelper } from './createSystemPromptHelper';
import { createItemHelper } from './createItemHelper';
import { createLocationHelper } from './createLocationHelper';
import { createWorldHelper } from './createWorldHelper';
import { createWorldMasterHelper } from './createWorldMasterHelper';

export function createAdventureRequestHelper (overrides?: Partial<CreateAdventureRequest>): CreateAdventureRequest {
    return {
        name: 'Test Adventure',
        systemPrompts: [createSystemPromptHelper()],
        characters: [createCharacterHelper()],
        worldMaster: createWorldMasterHelper(),
        locations: [createLocationHelper()],
        worlds: [createWorldHelper()],
        items: [createItemHelper()],
        ...overrides
    };
}

import { Adventure, WorldMaster } from '@domain/entities';
import { HydratedAdventure, HydratedCharacter } from '@domain/services';
import { createAdventureHelper } from './createAdventureHelper';
import { createAssistantHelper } from './createAssistantHelper';
import { createCharacterHelper } from './createCharacterHelper';
import { createConnectionHelper } from './createConnectionHelper';
import { createSamplerHelper } from './createSamplerHelper';
import { createWorldMasterHelper } from './createWorldMasterHelper';

export interface CreateHydratedAdventureHelperParams {
  adventure?: Partial<Adventure>;
  characters?: HydratedCharacter[];
  worldMaster?: WorldMaster;
  withoutWorldMaster?: boolean;
  modelId?: string;
  connectionId?: string;
}

export function createHydratedAdventureHelper (params: CreateHydratedAdventureHelperParams = {}): HydratedAdventure {
    const {
        adventure: adventureOverrides,
        characters: characterOverrides,
        worldMaster: worldMasterOverride,
        withoutWorldMaster,
        modelId,
        connectionId
    } = params;

    const adventure = createAdventureHelper(adventureOverrides);
    const connectionOverrides = connectionId ? { id: connectionId } : undefined;
    const connection = createConnectionHelper(connectionOverrides);
    const resolvedModelId = modelId ?? '1';
    const assistant = createAssistantHelper({
        connectionId: connection.id,
        modelId: resolvedModelId,
        samplerId: '1'
    });
    const defaultCharacter: HydratedCharacter = {
        ...createCharacterHelper({ assistantId: assistant.id }),
        abilities: [],
        proficiencies: [],
        statuses: [],
        worldMaster: false,
        aiControlled: false
    };
    const characters = characterOverrides ?? [defaultCharacter];
    const defaultWorldMaster = createWorldMasterHelper({ assistantId: assistant.id });
    const worldMaster = withoutWorldMaster ? undefined : worldMasterOverride ?? defaultWorldMaster;
    const assistantKey = assistant.id;
    const assistants = { [assistantKey]: assistant };

    return {
        adventure,
        characters,
        worldMaster,
        assistants,
        samplers: [createSamplerHelper()],
        connections: [connection],
        worlds: [],
        locations: [],
        items: [],
        systemPrompts: [],
        abilities: [],
        proficiencies: [],
        statuses: []
    };
}

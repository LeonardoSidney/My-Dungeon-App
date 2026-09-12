import { Adventure, Character, SystemPrompt, WorldMaster, World, Location, Item } from '@domain/entities';
import {
    CreateAdventureRequest,
    EditAdventureControllerParams,
    ICreateAdventureController,
    IEditAdventureController,
} from '@domain/controllers';
import { AdventureFormData, FormErrors } from './constants';
import { ControllerResponse } from '@application/ui/hooks';
import {
    buildAdventureCharacterIds,
    summarizeAdventureCharacters,
    validateAdventureCharacterSelection,
} from '@application/shared/adventureCharacterRules';

type AdventureFormEntityLists = {
    characters: Character[];
    systemPrompts: SystemPrompt[];
    worldMasters: WorldMaster[];
    worlds: World[];
    locations: Location[];
    items: Item[];
};

export function toAdventureFormState (adventure: Adventure, entities: AdventureFormEntityLists): AdventureFormData {
    const selectedSystemPrompts = entities.systemPrompts.filter(sp => adventure.systemPromptIds.includes(sp.id));

    const characterById = new Map(entities.characters.map(character => [character.id, character]));
    const summary = summarizeAdventureCharacters(adventure);

    const selectedCharacters = summary.playableCharacterIds
        .map(id => characterById.get(id))
        .filter((character): character is Character => character !== undefined);

    const selectedAiCharacters = summary.aiControlledCharacterIds
        .map(id => characterById.get(id))
        .filter((character): character is Character => character !== undefined);

    const selectedWorldMaster = adventure.worldMasterId
        ? entities.worldMasters.find(wm => wm.id === adventure.worldMasterId)
        : undefined;

    const selectedWorlds = entities.worlds.filter(w => adventure.worldIds.includes(w.id));
    const selectedLocations = entities.locations.filter(l => adventure.locationIds.includes(l.id));
    const selectedItems = entities.items.filter(i => adventure.itemIds.includes(i.id));

    return {
        id: adventure.id,
        name: adventure.name,
        systemPrompts: selectedSystemPrompts,
        characters: selectedCharacters,
        worldMaster: selectedWorldMaster,
        characterAsWorldMasterId: summary.characterAsWorldMasterId,
        charactersControlledByAi: selectedAiCharacters.map(character => character.id),
        worlds: selectedWorlds,
        locations: selectedLocations,
        items: selectedItems,
        chat: adventure.chat,
    };
}

function generateDefaultName (): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day} ${hours}:${minutes}:${seconds} new adventure`;
}

export function initialAdventureForm (): AdventureFormData {
    return {
        id: '',
        name: generateDefaultName(),
        systemPrompts: [],
        characters: [],
        worldMaster: undefined,
        characterAsWorldMasterId: undefined,
        charactersControlledByAi: [],
        worlds: [],
        locations: [],
        items: [],
        chat: [],
    };
}

export function toCreateParams (form: AdventureFormData): CreateAdventureRequest {
    const characterIds = buildAdventureCharacterIds({
        playableCharacterIds: form.characters.map(c => c.id),
        characterAsWorldMasterId: form.characterAsWorldMasterId,
        charactersControlledByAi: form.charactersControlledByAi,
    });
    return {
        name: form.name,
        systemPromptIds: form.systemPrompts.map(sp => sp.id),
        characterIds,
        worldMasterId: form.worldMaster?.id,
        characterAsWorldMasterId: form.characterAsWorldMasterId,
        charactersControlledByAi: form.charactersControlledByAi,
        worldIds: (form.worlds ?? []).map(w => w.id),
        locationIds: (form.locations ?? []).map(l => l.id),
        itemIds: (form.items ?? []).map(i => i.id),
    };
}

export function toEditParams (form: AdventureFormData): EditAdventureControllerParams {
    const characterIds = buildAdventureCharacterIds({
        playableCharacterIds: form.characters.map(c => c.id),
        characterAsWorldMasterId: form.characterAsWorldMasterId,
        charactersControlledByAi: form.charactersControlledByAi,
    });
    return {
        id: form.id ?? '',
        editParams: {
            name: form.name,
            systemPromptIds: form.systemPrompts.map(sp => sp.id),
            characterIds,
            worldMasterId: form.worldMaster?.id,
            characterAsWorldMasterId: form.characterAsWorldMasterId,
            charactersControlledByAi: form.charactersControlledByAi,
            worldIds: (form.worlds ?? []).map(w => w.id),
            locationIds: (form.locations ?? []).map(l => l.id),
            itemIds: (form.items ?? []).map(i => i.id),
            chat: form.chat,
        },
    };
}

export function validateAdventureForm (form: AdventureFormData): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    if (form.systemPrompts.length < 1) {
        errors.systemPrompts = 'A system prompt is required';
    }
    if (errors.systemPrompts) {
        return errors;
    }

    const characterIds = buildAdventureCharacterIds({
        playableCharacterIds: form.characters.map(c => c.id),
        characterAsWorldMasterId: form.characterAsWorldMasterId,
        charactersControlledByAi: form.charactersControlledByAi,
    });
    const characterError = validateAdventureCharacterSelection(
        {
            characterIds,
            worldMasterId: form.worldMaster?.id,
            characterAsWorldMasterId: form.characterAsWorldMasterId,
            charactersControlledByAi: form.charactersControlledByAi,
        },
        form.systemPrompts.length
    );
    if (characterError) {
        errors.characters = characterError;
    }
    return errors;
}

export function submitAdventure (
    form: AdventureFormData,
    createAdventure: ICreateAdventureController,
    editAdventure: IEditAdventureController
): Promise<ControllerResponse> {
    if (form.id) {
        return editAdventure.handle(toEditParams(form));
    }
    return createAdventure.handle(toCreateParams(form));
}

import {
    AdventureDetails,
    AdventureFormRequest,
    EntityOption,
    ICreateAdventureController,
    IEditAdventureController,
} from '@domain/controllers';
import { ControllerResponse } from '@presentation/hooks';

export type AdventureFormData = {
    id: string;
    name: string;
    systemPrompts: EntityOption[];
    characters: EntityOption[];
    worldMaster?: EntityOption;
    characterAsWorldMasterId?: string;
    charactersControlledByAi: string[];
    worlds: EntityOption[];
    locations: EntityOption[];
    items: EntityOption[];
};

export type AdventureFormErrors = {
    name?: string;
    systemPrompts?: string;
    characters?: string;
};

export type AdventureOptionLists = {
    characters: EntityOption[];
    systemPrompts: EntityOption[];
    worldMasters: EntityOption[];
    worlds: EntityOption[];
    locations: EntityOption[];
    items: EntityOption[];
};

function pickOptions (options: EntityOption[], ids: string[]): EntityOption[] {
    return ids
        .map(id => options.find(option => option.id === id))
        .filter((option): option is EntityOption => option !== undefined);
}

export function toAdventureFormState (adventure: AdventureDetails, options: AdventureOptionLists): AdventureFormData {
    return {
        id: adventure.id,
        name: adventure.name,
        systemPrompts: pickOptions(options.systemPrompts, adventure.systemPromptIds),
        characters: pickOptions(options.characters, adventure.playableCharacterIds),
        worldMaster: options.worldMasters.find(worldMaster => worldMaster.id === adventure.worldMasterId),
        characterAsWorldMasterId: adventure.characterAsWorldMasterId,
        charactersControlledByAi: adventure.aiControlledCharacterIds,
        worlds: pickOptions(options.worlds, adventure.worldIds),
        locations: pickOptions(options.locations, adventure.locationIds),
        items: pickOptions(options.items, adventure.itemIds),
    };
}

function generateDefaultName (now: Date = new Date()): string {
    const pad = (value: number) => String(value).padStart(2, '0');
    const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    return `${date} ${time} new adventure`;
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
    };
}

const toIds = (options: EntityOption[]) => options.map(option => option.id);

export function toAdventureRequest (form: AdventureFormData): AdventureFormRequest {
    return {
        name: form.name,
        systemPromptIds: toIds(form.systemPrompts),
        playableCharacterIds: toIds(form.characters),
        aiControlledCharacterIds: form.charactersControlledByAi,
        characterAsWorldMasterId: form.characterAsWorldMasterId,
        worldMasterId: form.worldMaster?.id,
        worldIds: toIds(form.worlds),
        locationIds: toIds(form.locations),
        itemIds: toIds(form.items),
    };
}

export function validateAdventureForm (form: AdventureFormData): AdventureFormErrors {
    const errors: AdventureFormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    return errors;
}

export function submitAdventure (
    form: AdventureFormData,
    createAdventure: ICreateAdventureController,
    editAdventure: IEditAdventureController,
): Promise<ControllerResponse> {
    if (form.id) {
        return editAdventure.handle({ id: form.id, editParams: toAdventureRequest(form) });
    }
    return createAdventure.handle(toAdventureRequest(form));
}

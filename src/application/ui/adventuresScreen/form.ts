import {
    AdventureDetails,
    AdventureFormRequest,
    CreateAdventureRequest,
    EditAdventureControllerParams,
    EntityOption,
    ICreateAdventureController,
    IEditAdventureController,
} from '@domain/controllers';
import { AdventureFormData, FormErrors } from './constants';
import { ControllerResponse } from '@application/ui/hooks';

type AdventureFormOptionLists = {
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

export function toAdventureFormState (adventure: AdventureDetails, options: AdventureFormOptionLists): AdventureFormData {
    return {
        id: adventure.id,
        name: adventure.name,
        systemPrompts: pickOptions(options.systemPrompts, adventure.systemPromptIds),
        characters: pickOptions(options.characters, adventure.playableCharacterIds),
        worldMaster: adventure.worldMasterId
            ? options.worldMasters.find(worldMaster => worldMaster.id === adventure.worldMasterId)
            : undefined,
        characterAsWorldMasterId: adventure.characterAsWorldMasterId,
        charactersControlledByAi: adventure.aiControlledCharacterIds,
        worlds: pickOptions(options.worlds, adventure.worldIds),
        locations: pickOptions(options.locations, adventure.locationIds),
        items: pickOptions(options.items, adventure.itemIds),
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
    };
}

function toAdventureRequest (form: AdventureFormData): AdventureFormRequest {
    return {
        name: form.name,
        systemPromptIds: form.systemPrompts.map(sp => sp.id),
        playableCharacterIds: form.characters.map(c => c.id),
        aiControlledCharacterIds: form.charactersControlledByAi,
        characterAsWorldMasterId: form.characterAsWorldMasterId,
        worldMasterId: form.worldMaster?.id,
        worldIds: (form.worlds ?? []).map(w => w.id),
        locationIds: (form.locations ?? []).map(l => l.id),
        itemIds: (form.items ?? []).map(i => i.id),
    };
}

export function toCreateParams (form: AdventureFormData): CreateAdventureRequest {
    return toAdventureRequest(form);
}

export function toEditParams (form: AdventureFormData): EditAdventureControllerParams {
    return {
        id: form.id ?? '',
        editParams: toAdventureRequest(form),
    };
}

export function validateAdventureForm (form: AdventureFormData): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
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

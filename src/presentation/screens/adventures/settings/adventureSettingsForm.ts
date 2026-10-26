import { AdventureDetails, ApplyAdventureSettingsControllerParams, EntityOption } from '@domain/controllers';
import { MINIMUM_NUMBER_SYSTEM_PROMPT, MINIMUM_PLAYABLE_CHARACTERS } from '@domain/constants/adventure';
import { toAdventureFormState, toAdventureRequest, type AdventureFormData, type AdventureOptionLists } from '../form/adventureForm';
import { emptyGenerationEdits, type GenerationEdits } from './generationEdits';
import { toSamplerParameters, validateSamplerValues, type SamplerValues } from './samplerValues';

export enum NarratorModeEnum {
    WORLD_MASTER = 'worldMaster',
    CHARACTER = 'character',
}

export type NarratorMode = NarratorModeEnum.WORLD_MASTER | NarratorModeEnum.CHARACTER;

export enum VoiceRoleEnum {
    NARRATOR = 'narrator',
    AI = 'ai',
    PLAYER = 'player',
}

export type VoiceRole = VoiceRoleEnum.NARRATOR | VoiceRoleEnum.AI | VoiceRoleEnum.PLAYER;

export enum VoiceSourceEnum {
    WORLD_MASTER = 'worldMaster',
    CHARACTER = 'character',
}

export type VoiceSource = VoiceSourceEnum.WORLD_MASTER | VoiceSourceEnum.CHARACTER;

export type GenerationVoice = {
    id: string;
    name: string;
    role: VoiceRole;
    source: VoiceSource;
};

export type AdventureSettingsForm = {
    adventure: AdventureFormData;
    narratorMode: NarratorMode;
    generation: GenerationEdits;
};

export type AdventureSettingsErrors = {
    name?: string;
    narrator?: string;
    cast?: string;
    systemPrompts?: string;
    samplers?: Record<string, SamplerValues>;
};

enum VoiceRosterFieldEnum {
    WORLD_MASTER = 'worldMaster',
    CHARACTER_AS_WORLD_MASTER_ID = 'characterAsWorldMasterId',
    CHARACTERS_CONTROLLED_BY_AI = 'charactersControlledByAi',
}

type VoiceRosterField =
    | VoiceRosterFieldEnum.WORLD_MASTER
    | VoiceRosterFieldEnum.CHARACTER_AS_WORLD_MASTER_ID
    | VoiceRosterFieldEnum.CHARACTERS_CONTROLLED_BY_AI;

type VoiceRoster = Pick<AdventureFormData, VoiceRosterField>;

export enum SettingsSectionEnum {
    GENERAL = 'general',
    NARRATOR = 'narrator',
    CAST = 'cast',
    CONTEXT = 'context',
}

export type SettingsSection =
    | SettingsSectionEnum.GENERAL
    | SettingsSectionEnum.NARRATOR
    | SettingsSectionEnum.CAST
    | SettingsSectionEnum.CONTEXT;

export type ModifiedSections = Record<SettingsSection, boolean>;

const UNKNOWN_CHARACTER = 'Unknown character';

const toIds = (options: EntityOption[]) => options.map(option => option.id);

const sectionSnapshots: Record<SettingsSection, (form: AdventureSettingsForm) => unknown> = {
    [SettingsSectionEnum.GENERAL]: form => form.adventure.name,
    [SettingsSectionEnum.NARRATOR]: form => [form.narratorMode, form.adventure.worldMaster?.id, form.adventure.characterAsWorldMasterId],
    [SettingsSectionEnum.CAST]: form => [toIds(form.adventure.characters), form.adventure.charactersControlledByAi],
    [SettingsSectionEnum.CONTEXT]: form => [
        toIds(form.adventure.systemPrompts),
        toIds(form.adventure.worlds),
        toIds(form.adventure.locations),
        toIds(form.adventure.items),
    ],
};

const settingsSections = Object.keys(sectionSnapshots) as SettingsSection[];

export function toAdventureSettingsForm (adventure: AdventureDetails, options: AdventureOptionLists): AdventureSettingsForm {
    const narratorMode: NarratorMode = adventure.characterAsWorldMasterId ? NarratorModeEnum.CHARACTER : NarratorModeEnum.WORLD_MASTER;

    return {
        adventure: toAdventureFormState(adventure, options),
        narratorMode,
        generation: emptyGenerationEdits,
    };
}

function getCastCharacterIds (adventure: AdventureFormData): string[] {
    const narratorCharacterIds = adventure.characterAsWorldMasterId ? [adventure.characterAsWorldMasterId] : [];
    return [...narratorCharacterIds, ...adventure.charactersControlledByAi, ...toIds(adventure.characters)];
}

function pickEntries<T> (record: Record<string, T>, isIncluded: (key: string) => boolean): Record<string, T> {
    return Object.fromEntries(Object.entries(record).filter(([key]) => isIncluded(key)));
}

export function toApplySettingsRequest (form: AdventureSettingsForm): ApplyAdventureSettingsControllerParams {
    const { adventure, generation } = form;
    const castCharacterIds = getCastCharacterIds(adventure);
    const samplerParameters = Object.entries(generation.samplerValues)
        .map(([samplerId, values]) => [samplerId, toSamplerParameters(values)]);

    return {
        adventureId: adventure.id,
        adventure: toAdventureRequest(adventure),
        characterAssistants: pickEntries(generation.voiceAssistants, id => castCharacterIds.includes(id)),
        worldMasterAssistants: pickEntries(generation.voiceAssistants, id => id === adventure.worldMaster?.id),
        assistantSamplers: generation.assistantSamplers,
        samplerParameters: Object.fromEntries(samplerParameters),
    };
}

function findCharacterName (characters: EntityOption[], id: string): string {
    return characters.find(character => character.id === id)?.name ?? UNKNOWN_CHARACTER;
}

function getNarratorVoice (adventure: VoiceRoster, characters: EntityOption[]): GenerationVoice | undefined {
    if (adventure.worldMaster) {
        const { id, name } = adventure.worldMaster;
        return { id, name, role: VoiceRoleEnum.NARRATOR, source: VoiceSourceEnum.WORLD_MASTER };
    }
    if (adventure.characterAsWorldMasterId) {
        const id = adventure.characterAsWorldMasterId;
        return { id, name: findCharacterName(characters, id), role: VoiceRoleEnum.NARRATOR, source: VoiceSourceEnum.CHARACTER };
    }
    return undefined;
}

export function getGenerationVoices (adventure: VoiceRoster, characters: EntityOption[]): GenerationVoice[] {
    const narrator = getNarratorVoice(adventure, characters);
    const aiVoices = adventure.charactersControlledByAi.map((id): GenerationVoice => (
        { id, name: findCharacterName(characters, id), role: VoiceRoleEnum.AI, source: VoiceSourceEnum.CHARACTER }
    ));
    if (!narrator) {
        return aiVoices;
    }
    return [narrator, ...aiVoices];
}

export function getPlayerVoices (characters: EntityOption[]): GenerationVoice[] {
    return characters.map((character): GenerationVoice => (
        { id: character.id, name: character.name, role: VoiceRoleEnum.PLAYER, source: VoiceSourceEnum.CHARACTER }
    ));
}

export function switchNarratorMode (form: AdventureSettingsForm, narratorMode: NarratorMode): AdventureSettingsForm {
    if (form.narratorMode === narratorMode) {
        return form;
    }
    if (narratorMode === NarratorModeEnum.CHARACTER) {
        return { ...form, narratorMode, adventure: { ...form.adventure, worldMaster: undefined } };
    }
    return { ...form, narratorMode, adventure: { ...form.adventure, characterAsWorldMasterId: undefined } };
}

function validateNarrator (form: AdventureSettingsForm): string | undefined {
    const hasNarrator = Boolean(form.adventure.worldMaster || form.adventure.characterAsWorldMasterId);
    if (hasNarrator) {
        return undefined;
    }
    if (form.narratorMode === NarratorModeEnum.CHARACTER) {
        return 'Pick the character who narrates the story';
    }
    return 'Pick a world master, nobody will answer the players without one';
}

function validateSamplers (generation: GenerationEdits): Record<string, SamplerValues> | undefined {
    const entries = Object.entries(generation.samplerValues)
        .map(([samplerId, values]) => [samplerId, validateSamplerValues(values)] as const)
        .filter((entry): entry is readonly [string, SamplerValues] => entry[1] !== undefined);
    if (entries.length === 0) {
        return undefined;
    }
    return Object.fromEntries(entries);
}

function removeEmptyErrors (errors: AdventureSettingsErrors): AdventureSettingsErrors {
    const entries = Object.entries(errors).filter(([, value]) => value !== undefined);
    return Object.fromEntries(entries);
}

export function validateAdventureSettings (form: AdventureSettingsForm): AdventureSettingsErrors {
    const { adventure } = form;
    const errors: AdventureSettingsErrors = {
        narrator: validateNarrator(form),
        samplers: validateSamplers(form.generation),
    };

    if (!adventure.name.trim()) {
        errors.name = 'Name is required';
    }
    if (adventure.characters.length < MINIMUM_PLAYABLE_CHARACTERS) {
        errors.cast = `At least ${MINIMUM_PLAYABLE_CHARACTERS} character must be played by you`;
    }
    if (adventure.systemPrompts.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
        errors.systemPrompts = `Select at least ${MINIMUM_NUMBER_SYSTEM_PROMPT} system prompt`;
    }

    return removeEmptyErrors(errors);
}

export function getModifiedSections (saved: AdventureSettingsForm, draft: AdventureSettingsForm): ModifiedSections {
    const entries = settingsSections.map(section => {
        const snapshot = sectionSnapshots[section];
        const isModified = JSON.stringify(snapshot(saved)) !== JSON.stringify(snapshot(draft));
        return [section, isModified];
    });
    return Object.fromEntries(entries);
}

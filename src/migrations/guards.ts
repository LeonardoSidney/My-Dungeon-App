import { isRecord } from '@infra/dto/shared';
import { Attribute, MirostatEnum } from '@domain/entities';
import {
    SeedAbility,
    SeedAdventure,
    SeedAssistant,
    SeedCharacter,
    SeedConnection,
    SeedItem,
    SeedLocation,
    SeedProficiency,
    SeedSampler,
    SeedStatus,
    SeedSystemPrompt,
    SeedWorld,
    SeedWorldMaster,
} from './types';

function isNonEmptyString (value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
}

function isNumber (value: unknown): value is number {
    return typeof value === 'number';
}

function isOptionalString (value: Record<string, unknown>, key: string): boolean {
    const field = value[key];
    const isMissing = field === undefined;
    if (isMissing) {
        return true;
    }
    return isNonEmptyString(field);
}

function isOptionalNumber (value: Record<string, unknown>, key: string): boolean {
    const field = value[key];
    const isMissing = field === undefined;
    if (isMissing) {
        return true;
    }
    return isNumber(field);
}

function isStringArray (value: unknown): value is string[] {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isOptionalStringArray (value: Record<string, unknown>, key: string): boolean {
    const field = value[key];
    const isMissing = field === undefined;
    if (isMissing) {
        return true;
    }
    return isStringArray(field);
}

function isSeedAttribute (value: unknown): value is Attribute {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasValue = isNumber(value.value);
    return hasName && hasValue;
}

function isOptionalAttributeArray (value: Record<string, unknown>, key: string): boolean {
    const field = value[key];
    const isMissing = field === undefined;
    if (isMissing) {
        return true;
    }
    return Array.isArray(field) && field.every(item => isSeedAttribute(item));
}

export function isSeedConnection (value: unknown): value is SeedConnection {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasIp = isNonEmptyString(value.ip);
    const hasPort = isOptionalNumber(value, 'port');
    const hasAuth = isOptionalString(value, 'auth');
    return hasName && hasIp && hasPort && hasAuth;
}

const SEED_SAMPLER_NUMBER_FIELDS: string[] = [
    'adaptativeDecay',
    'adaptativeTarget',
    'dryAllowedLenght',
    'dryBase',
    'dryMultiplier',
    'dynaTempExp',
    'dynaTempRange',
    'minP',
    'mirostatEnt',
    'mirostatLr',
    'frequencyPenalty',
    'presencePenalty',
    'repeatLastN',
    'repeatPenalty',
    'temperature',
    'topK',
    'topNSigma',
    'topP',
    'typicalP',
    'xtcProbability',
    'xtcThreshould',
];

export function isSeedSampler (value: unknown): value is SeedSampler {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasNumbers = SEED_SAMPLER_NUMBER_FIELDS.every(field => isOptionalNumber(value, field));
    const mirostat = value.mirostat;
    const hasMirostat = mirostat === undefined || mirostat === MirostatEnum.DEFAULT || mirostat === MirostatEnum.MIROSTAT1 || mirostat === MirostatEnum.MIROSTAT2;
    const hasObservation = isOptionalString(value, 'observation');
    const hasDrySequenceBreakers = isOptionalString(value, 'drySequenceBreakers');
    const hasSeed = isOptionalString(value, 'seed');
    const hasIgnoreEos = value.ignoreEOS === undefined || typeof value.ignoreEOS === 'boolean';
    return hasName && hasNumbers && hasMirostat && hasObservation && hasDrySequenceBreakers && hasSeed && hasIgnoreEos;
}

export function isSeedAssistant (value: unknown): value is SeedAssistant {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasModelId = isNonEmptyString(value.modelId);
    const hasSampler = isNonEmptyString(value.sampler);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasModelId && hasSampler && hasObservation;
}

export function isSeedAbility (value: unknown): value is SeedAbility {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasActivationWord = isNonEmptyString(value.activationWord);
    const hasPrompt = isNonEmptyString(value.prompt);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasActivationWord && hasPrompt && hasObservation;
}

export function isSeedStatus (value: unknown): value is SeedStatus {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasActivationWord = isNonEmptyString(value.activationWord);
    const hasPrompt = isNonEmptyString(value.prompt);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasActivationWord && hasPrompt && hasObservation;
}

export function isSeedProficiency (value: unknown): value is SeedProficiency {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasActivationWord = isNonEmptyString(value.activationWord);
    const hasPrompt = isNonEmptyString(value.prompt);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasActivationWord && hasPrompt && hasObservation;
}

export function isSeedCharacter (value: unknown): value is SeedCharacter {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasActivationWord = isNonEmptyString(value.activationWord);
    const hasPrompt = isNonEmptyString(value.prompt);
    const hasAssistant = isNonEmptyString(value.assistant);
    const hasObservation = isOptionalString(value, 'observation');
    const hasAbilities = isOptionalStringArray(value, 'abilities');
    const hasProficiencies = isOptionalStringArray(value, 'proficiencies');
    const hasStatuses = isOptionalStringArray(value, 'statuses');
    const hasAttributes = isOptionalAttributeArray(value, 'attributes');
    return hasName && hasActivationWord && hasPrompt && hasAssistant && hasObservation && hasAbilities && hasProficiencies && hasStatuses && hasAttributes;
}

export function isSeedWorldMaster (value: unknown): value is SeedWorldMaster {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasActivationWord = isNonEmptyString(value.activationWord);
    const hasPrompt = isNonEmptyString(value.prompt);
    const hasAssistant = isNonEmptyString(value.assistant);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasActivationWord && hasPrompt && hasAssistant && hasObservation;
}

export function isSeedSystemPrompt (value: unknown): value is SeedSystemPrompt {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasContent = isNonEmptyString(value.content);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasContent && hasObservation;
}

export function isSeedWorld (value: unknown): value is SeedWorld {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasActivationWord = isNonEmptyString(value.activationWord);
    const hasPrompt = isNonEmptyString(value.prompt);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasActivationWord && hasPrompt && hasObservation;
}

export function isSeedLocation (value: unknown): value is SeedLocation {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasActivationWord = isNonEmptyString(value.activationWord);
    const hasPrompt = isNonEmptyString(value.prompt);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasActivationWord && hasPrompt && hasObservation;
}

export function isSeedItem (value: unknown): value is SeedItem {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasActivationWord = isNonEmptyString(value.activationWord);
    const hasPrompt = isNonEmptyString(value.prompt);
    const hasObservation = isOptionalString(value, 'observation');
    return hasName && hasActivationWord && hasPrompt && hasObservation;
}

export function isSeedAdventure (value: unknown): value is SeedAdventure {
    if (!isRecord(value)) {
        return false;
    }
    const hasName = isNonEmptyString(value.name);
    const hasCharacters = isStringArray(value.characters);
    const hasSystemPrompts = isStringArray(value.systemPrompts);
    const hasWorlds = isStringArray(value.worlds);
    const hasLocations = isStringArray(value.locations);
    const hasItems = isStringArray(value.items);
    const hasCharactersControlledByAi = isStringArray(value.charactersControlledByAi);
    const hasWorldMaster = isOptionalString(value, 'worldMaster');
    return hasName && hasCharacters && hasSystemPrompts && hasWorlds && hasLocations && hasItems && hasCharactersControlledByAi && hasWorldMaster;
}

export function parseSeedArray<T> (data: unknown, label: string, isSeed: (value: unknown) => value is T): T[] {
    if (!Array.isArray(data)) {
        throw new Error(`Migration: seed ${label} is invalid, expected an array of objects`);
    }
    for (let index = 0; index < data.length; index += 1) {
        const entry = data[index];
        if (!isSeed(entry)) {
            throw new Error(`Migration: seed ${label} entry ${index} is invalid`);
        }
    }
    return data;
}

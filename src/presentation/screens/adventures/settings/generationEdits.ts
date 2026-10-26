import { getChangedSamplerKeys, setSamplerValue, type SamplerValueKey, type SamplerValues } from './samplerValues';

export type GenerationEdits = {
    voiceAssistants: Record<string, string>;
    assistantSamplers: Record<string, string>;
    samplerValues: Record<string, SamplerValues>;
};

export const emptyGenerationEdits: GenerationEdits = {
    voiceAssistants: {},
    assistantSamplers: {},
    samplerValues: {},
};

function withEdit<T> (record: Record<string, T>, key: string, value: T | undefined): Record<string, T> {
    const others = Object.entries(record).filter(([existingKey]) => existingKey !== key);
    if (value === undefined) {
        return Object.fromEntries(others);
    }
    return Object.fromEntries([...others, [key, value]]);
}

function toEditedValue<T> (value: T | undefined, savedValue: T | undefined): T | undefined {
    if (value === savedValue) {
        return undefined;
    }
    return value;
}

export function setVoiceAssistant (
    edits: GenerationEdits,
    voiceId: string,
    assistantId: string | undefined,
    savedAssistantId: string | undefined,
): GenerationEdits {
    const voiceAssistants = withEdit(edits.voiceAssistants, voiceId, toEditedValue(assistantId, savedAssistantId));
    return { ...edits, voiceAssistants };
}

export function setAssistantSampler (
    edits: GenerationEdits,
    assistantId: string,
    samplerId: string | undefined,
    savedSamplerId: string | undefined,
): GenerationEdits {
    const assistantSamplers = withEdit(edits.assistantSamplers, assistantId, toEditedValue(samplerId, savedSamplerId));
    return { ...edits, assistantSamplers };
}

export function setSamplerFieldValue (
    edits: GenerationEdits,
    samplerId: string,
    key: SamplerValueKey,
    value: string,
    savedValues: SamplerValues,
): GenerationEdits {
    const current = edits.samplerValues[samplerId] ?? savedValues;
    const next = setSamplerValue(current, key, value);
    const isUnchanged = getChangedSamplerKeys(next, savedValues).length === 0;
    const editedValues = isUnchanged ? undefined : next;
    return { ...edits, samplerValues: withEdit(edits.samplerValues, samplerId, editedValues) };
}

export function hasGenerationEdits (edits: GenerationEdits): boolean {
    return [edits.voiceAssistants, edits.assistantSamplers, edits.samplerValues].some(record => Object.keys(record).length > 0);
}

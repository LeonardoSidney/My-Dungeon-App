import { AssistantDetails, ConnectionListItem, SamplerListItem } from '@domain/controllers';
import type { GenerationVoice } from './adventureSettingsForm';
import type { GenerationEdits } from './generationEdits';
import { toSamplerValues, type SamplerValues } from './samplerValues';

export type GenerationCatalog = {
    assistants: AssistantDetails[];
    samplers: SamplerListItem[];
    connections: ConnectionListItem[];
    profileAssistantIds: Record<string, string | undefined>;
};

export type VoiceRuntime = {
    assistant?: AssistantDetails;
    savedAssistant?: AssistantDetails;
    sampler?: SamplerListItem;
    savedSampler?: SamplerListItem;
    connection?: ConnectionListItem;
    samplerValues: SamplerValues;
    savedSamplerValues: SamplerValues;
    isAssistantEdited: boolean;
    isSamplerEdited: boolean;
    areValuesEdited: boolean;
};

export type VoiceSharing = {
    assistant: string[];
    sampler: string[];
};

export function resolveVoiceRuntime (voiceId: string, edits: GenerationEdits, catalog: GenerationCatalog): VoiceRuntime {
    const findAssistant = (id?: string) => catalog.assistants.find(assistant => assistant.id === id);
    const findSampler = (id?: string) => catalog.samplers.find(sampler => sampler.id === id);

    const savedAssistant = findAssistant(catalog.profileAssistantIds[voiceId]);
    const editedAssistantId = edits.voiceAssistants[voiceId];
    const assistant = findAssistant(editedAssistantId) ?? savedAssistant;

    const savedSampler = findSampler(assistant?.samplerId);
    const editedSamplerId = assistant ? edits.assistantSamplers[assistant.id] : undefined;
    const sampler = findSampler(editedSamplerId) ?? savedSampler;

    const savedSamplerValues = toSamplerValues(sampler);
    const editedValues = sampler ? edits.samplerValues[sampler.id] : undefined;

    return {
        assistant,
        savedAssistant,
        sampler,
        savedSampler,
        connection: catalog.connections.find(item => item.id === assistant?.connectionId),
        samplerValues: editedValues ?? savedSamplerValues,
        savedSamplerValues,
        isAssistantEdited: editedAssistantId !== undefined,
        isSamplerEdited: editedSamplerId !== undefined,
        areValuesEdited: editedValues !== undefined,
    };
}

export function isVoiceEdited (runtime: VoiceRuntime): boolean {
    return runtime.isAssistantEdited || runtime.isSamplerEdited || runtime.areValuesEdited;
}

export function findVoiceSharing (
    voice: GenerationVoice,
    voices: GenerationVoice[],
    edits: GenerationEdits,
    catalog: GenerationCatalog,
): VoiceSharing {
    const runtime = resolveVoiceRuntime(voice.id, edits, catalog);
    const others = voices
        .filter(other => other.id !== voice.id)
        .map(other => ({ name: other.name, runtime: resolveVoiceRuntime(other.id, edits, catalog) }));

    const assistant = others
        .filter(other => runtime.assistant && other.runtime.assistant?.id === runtime.assistant.id)
        .map(other => other.name);
    const sampler = others
        .filter(other => runtime.sampler && other.runtime.sampler?.id === runtime.sampler.id)
        .map(other => other.name);

    return { assistant, sampler };
}

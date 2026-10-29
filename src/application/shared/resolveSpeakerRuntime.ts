import type { SpeakerRuntime, TurnSpeaker } from '@domain/services';
import type { HydratedAdventure } from '@domain/use-cases';

export function resolveSpeakerRuntime (hydrated: HydratedAdventure, speaker: TurnSpeaker): SpeakerRuntime | null {
    const assistant = hydrated.assistants[speaker.assistantId];
    if (!assistant) return null;

    const connection = hydrated.connections.find(c => c.id === assistant.connectionId);
    if (!connection) return null;

    return {
        connectionId: connection.id,
        samplerId: assistant.samplerId,
        modelId: assistant.modelId,
        characterId: speaker.characterId,
    };
}

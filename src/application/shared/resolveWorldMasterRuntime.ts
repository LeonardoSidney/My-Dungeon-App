import type { HydratedAdventure } from '@domain/use-cases';

export type WorldMasterRuntime = {
    connectionId: string;
    samplerId: string;
    modelId: string;
    characterId: string;
};

export function resolveWorldMasterRuntime (hydrated: HydratedAdventure): WorldMasterRuntime | null {
    const worldMaster = hydrated.worldMaster;
    const worldMasterCharacter = worldMaster
        ? undefined
        : hydrated.characters.find(c => c.worldMaster === true);

    const assistantId = worldMaster
        ? worldMaster.assistantId
        : worldMasterCharacter?.assistantId;

    const characterId = worldMaster
        ? worldMaster.id
        : worldMasterCharacter?.id;

    if (!assistantId || !characterId) return null;

    const assistant = hydrated.assistants[assistantId];
    if (!assistant) return null;

    const connection = hydrated.connections.find(c => c.id === assistant.connectionId);
    if (!connection) return null;

    return {
        connectionId: connection.id,
        samplerId: assistant.samplerId,
        modelId: assistant.modelId,
        characterId,
    };
}

export function resolveWorldMasterRuntimeFor (adventureId: string, hydrated: HydratedAdventure): WorldMasterRuntime | null {
    if (hydrated.adventure.id !== adventureId) return null;

    return resolveWorldMasterRuntime(hydrated);
}

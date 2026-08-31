import { RefObject } from 'react';
import { Alert } from 'react-native';
import { Adventure, RoleEnum } from '@domain/entities';
import { HydratedAdventure } from '@domain/use-cases';
import {
    startStreamingChatController,
    updateStreamingChatController,
    finishStreamingChatController,
    getAdventureTextController,
    getNativeStreamCompletionController,
} from '@infra/container';
import { parseThinkContent } from './parseThinkContent';

export interface HandleStreamResponseParams {
    adventureToUpdate: Adventure;
    hydratedRef: RefObject<HydratedAdventure | null>;
    isAbortedRef: { current: boolean; };
    setIsStreaming: (isStreaming: boolean) => void;
    streamRef: { current: AsyncGenerator<string, void, void> | null; };
    abortRef: { current: (() => void) | null; };
    setCurrentAdventure: (adventure: Adventure) => void;
}

type WorldMasterRuntime = {
    connectionId: string;
    samplerId: string;
    modelId: string;
    characterId: string;
};

function resolveWorldMasterRuntime (hydrated: HydratedAdventure | null): WorldMasterRuntime | null {
    if (!hydrated) return null;

    const dedicatedWorldMaster = hydrated.worldMaster;
    const worldMasterCharacter = dedicatedWorldMaster
        ? undefined
        : hydrated.characters.find(c => c.worldMaster === true);

    const assistantId = dedicatedWorldMaster
        ? dedicatedWorldMaster.assistantId
        : worldMasterCharacter?.assistantId;

    const characterId = dedicatedWorldMaster
        ? dedicatedWorldMaster.id
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

export async function handleStreamResponse ({
    adventureToUpdate,
    hydratedRef,
    isAbortedRef,
    setIsStreaming,
    streamRef,
    abortRef,
    setCurrentAdventure,
}: HandleStreamResponseParams): Promise<Adventure | null> {
    const runtime = resolveWorldMasterRuntime(hydratedRef.current);
    if (!runtime) return null;

    const textController = getAdventureTextController();
    const textResponse = await textController.handle({
        adventure: adventureToUpdate,
    });

    if (!textResponse.success || !textResponse.prompt) {
        Alert.alert('Erro', textResponse.error ?? 'Failed to generate adventure text');
        return null;
    }

    const streamController = getNativeStreamCompletionController();
    const result = await streamController.handle({
        connectionId: runtime.connectionId,
        samplerId: runtime.samplerId,
        modelId: runtime.modelId,
        prompt: textResponse.prompt,
    });

    if (!result.success || !result.stream) {
        Alert.alert('Erro', result.error ?? 'Failed to start model stream');
        return null;
    }

    isAbortedRef.current = false;
    setIsStreaming(true);

    const stream = result.stream as AsyncGenerator<string, void, void>;
    streamRef.current = stream;
    abortRef.current = result.abort || null;

    const startResponse = await startStreamingChatController().handle({
        adventure: adventureToUpdate,
        role: RoleEnum.ASSISTANT,
        characterId: runtime.characterId,
    });

    if (!startResponse.success || !startResponse.chat || !startResponse.adventure) {
        Alert.alert('Erro', startResponse.error ?? 'Failed to start assistant chat');
        setIsStreaming(false);
        return null;
    }

    setCurrentAdventure(startResponse.adventure);

    let currentText = '';
    let lastUpdateTime = Date.now();
    const throttleInterval = 100;
    let lastUpdatedAdventure = startResponse.adventure;

    for await (const token of result.stream) {
        if (isAbortedRef.current) break;
        currentText += token;

        const now = Date.now();
        if (now - lastUpdateTime >= throttleInterval) {
            const { think, content } = parseThinkContent(currentText);
            const updateResponse = await updateStreamingChatController().handle({
                adventure: lastUpdatedAdventure,
                chatId: startResponse.chat.id,
                content,
                think,
            });

            if (updateResponse.success && updateResponse.adventure) {
                lastUpdatedAdventure = updateResponse.adventure;
                setCurrentAdventure(updateResponse.adventure);
            }
            lastUpdateTime = now;
        }
    }

    const { think: finalThink, content: finalContent } = parseThinkContent(currentText);

    const updateResponse = await updateStreamingChatController().handle({
        adventure: lastUpdatedAdventure,
        chatId: startResponse.chat.id,
        content: finalContent,
        think: finalThink,
    });

    if (!updateResponse.success || !updateResponse.adventure) {
        Alert.alert('Erro', updateResponse.error ?? 'Failed to save the final assistant message');
    }

    if (updateResponse.success && updateResponse.adventure) {
        lastUpdatedAdventure = updateResponse.adventure;
        setCurrentAdventure(updateResponse.adventure);
    }

    const finishResponse = await finishStreamingChatController().handle({
        adventure: lastUpdatedAdventure,
        chatId: startResponse.chat.id,
    });

    if (!finishResponse.success || !finishResponse.adventure) {
        Alert.alert('Erro', finishResponse.error ?? 'Failed to finalize the assistant chat');
    }

    if (finishResponse.success && finishResponse.adventure) {
        lastUpdatedAdventure = finishResponse.adventure;
        setCurrentAdventure(finishResponse.adventure);
    }

    setIsStreaming(false);
    streamRef.current = null;

    return lastUpdatedAdventure;
}

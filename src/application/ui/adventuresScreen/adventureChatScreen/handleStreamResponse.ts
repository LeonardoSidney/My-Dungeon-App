import { Adventure, RoleEnum } from '@domain/entities';
import { HydratedAdventure } from '@domain/use-cases';
import {
    IAlertController,
    IStartStreamingChatController,
    IUpdateStreamingChatController,
    IFinishStreamingChatController,
    IDeleteChatAdventureController,
    IGetAdventureTextController,
    INativeStreamCompletionController,
} from '@domain/controllers';
import { resolveWorldMasterRuntimeFor } from '@application/shared/resolveWorldMasterRuntime';
import { parseThinkContent } from './parseThinkContent';

export interface HandleStreamResponseParams {
    adventureToUpdate: Adventure;
    existingChatId?: string;
    hydrated: HydratedAdventure;
    isAbortedRef: { current: boolean; };
    setIsStreaming: (isStreaming: boolean) => void;
    streamRef: { current: AsyncGenerator<string, void, void> | null; };
    abortRef: { current: (() => void) | null; };
    setCurrentAdventure: (adventure: Adventure) => void;
    startStreamingChat: IStartStreamingChatController;
    updateStreamingChat: IUpdateStreamingChatController;
    finishStreamingChat: IFinishStreamingChatController;
    deleteChatAdventure: IDeleteChatAdventureController;
    getAdventureText: IGetAdventureTextController;
    getNativeStreamCompletion: INativeStreamCompletionController;
    alert: IAlertController;
}

export async function handleStreamResponse ({
    adventureToUpdate,
    existingChatId,
    hydrated,
    isAbortedRef,
    setIsStreaming,
    streamRef,
    abortRef,
    setCurrentAdventure,
    startStreamingChat,
    updateStreamingChat,
    finishStreamingChat,
    deleteChatAdventure,
    getAdventureText,
    getNativeStreamCompletion,
    alert,
}: HandleStreamResponseParams): Promise<Adventure | null> {
    const runtime = resolveWorldMasterRuntimeFor(adventureToUpdate.id, hydrated);
    if (!runtime) return null;

    const textResponse = await getAdventureText.handle({
        adventure: adventureToUpdate,
        hydrated,
    });

    if (!textResponse.success || !textResponse.prompt) {
        alert.handle({ title: 'Erro', message: textResponse.error ?? 'Failed to generate adventure text' });
        return null;
    }

    const result = await getNativeStreamCompletion.handle({
        adventureId: adventureToUpdate.id,
        connectionId: runtime.connectionId,
        samplerId: runtime.samplerId,
        modelId: runtime.modelId,
        prompt: textResponse.prompt,
        hydrated,
    });

    if (!result.success || !result.stream) {
        alert.handle({ title: 'Erro', message: result.error ?? 'Failed to start model stream' });
        return null;
    }

    isAbortedRef.current = false;
    setIsStreaming(true);

    const stream = result.stream as AsyncGenerator<string, void, void>;
    streamRef.current = stream;
    abortRef.current = result.abort || null;

    const startResponse = await startStreamingChat.handle({
        adventure: adventureToUpdate,
        role: RoleEnum.ASSISTANT,
        characterId: runtime.characterId,
        chatId: existingChatId,
    });

    if (!startResponse.success || !startResponse.chat || !startResponse.adventure) {
        alert.handle({ title: 'Erro', message: startResponse.error ?? 'Failed to start assistant chat' });
        setIsStreaming(false);
        return null;
    }

    setCurrentAdventure(startResponse.adventure);

    const streamingChat = startResponse.chat;
    const continuationBase = existingChatId ? streamingChat.content[streamingChat.index] ?? '' : '';
    let currentText = continuationBase;
    let lastUpdateTime = Date.now();
    const throttleInterval = 100;
    let lastUpdatedAdventure = startResponse.adventure;

    for await (const token of result.stream) {
        if (isAbortedRef.current) break;
        currentText += token;

        const now = Date.now();
        if (now - lastUpdateTime >= throttleInterval) {
            const { think, content } = parseThinkContent(currentText);
            const updateResponse = await updateStreamingChat.handle({
                adventure: lastUpdatedAdventure,
                chatId: streamingChat.id,
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

    if (!currentText.trim()) {
        const removeResponse = await deleteChatAdventure.handle({
            adventure: lastUpdatedAdventure,
            chatId: streamingChat.id,
            index: 0,
        });

        if (removeResponse.success && removeResponse.adventure) {
            setCurrentAdventure(removeResponse.adventure);
            setIsStreaming(false);
            streamRef.current = null;
            return removeResponse.adventure;
        }

        alert.handle({ title: 'Erro', message: removeResponse.error ?? 'Failed to remove the empty assistant chat' });
        setIsStreaming(false);
        streamRef.current = null;
        return lastUpdatedAdventure;
    }

    const { think: finalThink, content: finalContent } = parseThinkContent(currentText);

    const updateResponse = await updateStreamingChat.handle({
        adventure: lastUpdatedAdventure,
        chatId: streamingChat.id,
        content: finalContent,
        think: finalThink,
    });

    if (!updateResponse.success || !updateResponse.adventure) {
        alert.handle({ title: 'Erro', message: updateResponse.error ?? 'Failed to save the final assistant message' });
    }

    if (updateResponse.success && updateResponse.adventure) {
        lastUpdatedAdventure = updateResponse.adventure;
        setCurrentAdventure(updateResponse.adventure);
    }

    const finishResponse = await finishStreamingChat.handle({
        adventure: lastUpdatedAdventure,
        chatId: streamingChat.id,
    });

    if (!finishResponse.success || !finishResponse.adventure) {
        alert.handle({ title: 'Erro', message: finishResponse.error ?? 'Failed to finalize the assistant chat' });
    }

    if (finishResponse.success && finishResponse.adventure) {
        lastUpdatedAdventure = finishResponse.adventure;
        setCurrentAdventure(finishResponse.adventure);
    }

    setIsStreaming(false);
    streamRef.current = null;

    return lastUpdatedAdventure;
}

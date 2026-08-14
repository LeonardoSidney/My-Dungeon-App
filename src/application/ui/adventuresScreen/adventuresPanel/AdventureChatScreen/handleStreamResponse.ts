import { Adventure, RoleEnum } from '@domain/entities';
import {
    startStreamingChatController,
    updateStreamingChatController,
    finishStreamingChatController,
    // getStreamCompletionController,
    getAdventureTextController,
    getNativeStreamCompletionController,
} from '@infra/container';
import { parseThinkContent } from './parseThinkContent';

export interface HandleStreamResponseParams {
    adventureToUpdate: Adventure;
    isAbortedRef: { current: boolean; };
    setIsStreaming: (isStreaming: boolean) => void;
    streamRef: { current: AsyncGenerator<string, void, void> | null; };
    abortRef: { current: (() => void) | null; };
    setCurrentAdventure: (adventure: Adventure) => void;
}

export async function handleStreamResponse ({
    adventureToUpdate,
    isAbortedRef,
    setIsStreaming,
    streamRef,
    abortRef,
    setCurrentAdventure,
}: HandleStreamResponseParams): Promise<Adventure | null> {
    const worldMaster = adventureToUpdate.worldMaster || adventureToUpdate.characters.find(c => c.worldMaster);
    if (!worldMaster) return null;

    const assistant = worldMaster.assistant;
    const connection = assistant.model.connection;
    const modelId = assistant.model.name;
    const sampler = assistant.sampler;

    const textController = getAdventureTextController();
    const textResponse = await textController.handle({
        adventure: adventureToUpdate,
    });

    if (!textResponse.success || !textResponse.prompt) return null;

    // const streamController = getStreamCompletionController();
    const streamController = getNativeStreamCompletionController();
    const result = await streamController.handle({
        connection,
        sampler,
        modelId,
        prompt: textResponse.prompt,
    });

    if (!result.success || !result.stream) return null;

    isAbortedRef.current = false;
    setIsStreaming(true);

    const stream = result.stream as AsyncGenerator<string, void, void>;
    streamRef.current = stream;
    abortRef.current = result.abort || null;

    const startResponse = await startStreamingChatController().handle({
        adventure: adventureToUpdate,
        role: RoleEnum.ASSISTANT,
        characterName: worldMaster.name,
    });

    if (!startResponse.success || !startResponse.chat || !startResponse.adventure) {
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

    if (updateResponse.success && updateResponse.adventure) {
        lastUpdatedAdventure = updateResponse.adventure;
        setCurrentAdventure(updateResponse.adventure);
    }

    const finishResponse = await finishStreamingChatController().handle({
        adventure: lastUpdatedAdventure,
        chatId: startResponse.chat.id,
    });

    if (finishResponse.success && finishResponse.adventure) {
        lastUpdatedAdventure = finishResponse.adventure;
        setCurrentAdventure(finishResponse.adventure);
    }

    setIsStreaming(false);
    streamRef.current = null;

    return lastUpdatedAdventure;
}

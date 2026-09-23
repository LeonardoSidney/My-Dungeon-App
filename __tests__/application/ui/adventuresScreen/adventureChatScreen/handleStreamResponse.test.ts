import { Adventure, RoleEnum } from '@domain/entities';
import { HydratedAdventure } from '@domain/use-cases';
import { handleStreamResponse, HandleStreamResponseParams } from '@application/ui/adventuresScreen/adventureChatScreen/handleStreamResponse';
import {
    createAdventureHelper,
    createCharacterHelper,
    createHydratedAdventureHelper
} from '@test/helpers';

function createChat () {
    const now = new Date();
    return {
        id: 'chat-1',
        role: RoleEnum.ASSISTANT,
        index: 1,
        content: [],
        characterId: '1',
        createdAt: now,
        updatedAt: now
    };
}

function asyncTokens (tokens: string[]) {
    return (async function* () {
        for (const token of tokens) {
            yield token;
        }
    })();
}

function buildMocks (streamTokens: string[] = ['Hello', ' world']) {
    const streamingChat = createChat();
    const startedAdventure = createAdventureHelper({ chat: [streamingChat] });
    const updatedAdventure = createAdventureHelper({ chat: [streamingChat] });
    const finalAdventure = createAdventureHelper({ chat: [streamingChat] });

    const startStreamingChat = {
        handle: jest.fn().mockResolvedValue({
            success: true,
            chat: streamingChat,
            adventure: startedAdventure
        })
    };
    const updateStreamingChat = {
        handle: jest.fn().mockResolvedValue({
            success: true,
            chat: streamingChat,
            adventure: updatedAdventure
        })
    };
    const finishStreamingChat = {
        handle: jest.fn().mockResolvedValue({
            success: true,
            chat: streamingChat,
            adventure: finalAdventure
        })
    };
    const getAdventureText = {
        handle: jest.fn().mockResolvedValue({ success: true, prompt: 'prompt' })
    };
    const getNativeStreamCompletion = {
        handle: jest.fn().mockResolvedValue({
            success: true,
            stream: asyncTokens(streamTokens),
            abort: jest.fn()
        })
    };
    const removedAdventure = createAdventureHelper({ chat: [] });
    const deleteChatAdventure = {
        handle: jest.fn().mockResolvedValue({
            success: true,
            adventure: removedAdventure
        })
    };
    const alert = { handle: jest.fn() };

    return {
        streamingChat,
        finalAdventure,
        removedAdventure,
        startStreamingChat,
        updateStreamingChat,
        finishStreamingChat,
        getAdventureText,
        getNativeStreamCompletion,
        deleteChatAdventure,
        alert
    };
}

function buildParams (adventure: Adventure, hydrated: HydratedAdventure, mocks: ReturnType<typeof buildMocks>): HandleStreamResponseParams {
    const isAbortedRef = { current: false };
    const streamRef = { current: null as AsyncGenerator<string, void, void> | null };
    const abortRef = { current: null as (() => void) | null };

    return {
        adventureToUpdate: adventure,
        hydrated,
        isAbortedRef,
        streamRef,
        abortRef,
        setIsStreaming: jest.fn(),
        setCurrentAdventure: jest.fn(),
        startStreamingChat: mocks.startStreamingChat,
        updateStreamingChat: mocks.updateStreamingChat,
        finishStreamingChat: mocks.finishStreamingChat,
        deleteChatAdventure: mocks.deleteChatAdventure,
        getAdventureText: mocks.getAdventureText,
        getNativeStreamCompletion: mocks.getNativeStreamCompletion,
        alert: mocks.alert
    };
}

describe('handleStreamResponse', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('streams with the world master runtime and reuses the provided hydrated adventure', async () => {
        const adventure = createAdventureHelper({
            name: 'Adventure',
            worldMasterId: '1',
            characterIds: ['1']
        });
        const hydrated = createHydratedAdventureHelper({
            adventure,
            characters: [{
                ...createCharacterHelper(),
                abilities: [],
                proficiencies: [],
                statuses: [],
                worldMaster: false,
                aiControlled: false
            }]
        });
        const mocks = buildMocks();
        const params = buildParams(adventure, hydrated, mocks);

        const result = await handleStreamResponse(params);

        expect(params.getAdventureText.handle).toHaveBeenCalledWith({
            adventure,
            hydrated
        });
        expect(params.getNativeStreamCompletion.handle).toHaveBeenCalledWith({
            adventureId: 'adventure-1',
            connectionId: '1',
            samplerId: '1',
            modelId: '1',
            prompt: 'prompt',
            hydrated
        });
        expect(params.startStreamingChat.handle).toHaveBeenCalledWith(expect.objectContaining({
            adventure,
            role: RoleEnum.ASSISTANT,
            characterId: '1'
        }));
        expect(params.setIsStreaming).toHaveBeenNthCalledWith(1, true);
        expect(params.setIsStreaming).toHaveBeenNthCalledWith(2, false);
        expect(params.updateStreamingChat.handle).toHaveBeenCalledTimes(1);
        expect(params.finishStreamingChat.handle).toHaveBeenCalledWith(expect.objectContaining({
            chatId: 'chat-1'
        }));
        expect(result).toBe(mocks.finalAdventure);
    });

    it('uses the runtime of the swapped world master from the hydrated adventure', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const hydrated = createHydratedAdventureHelper({
            adventure,
            modelId: 'model-new',
            connectionId: 'connection-new'
        });
        const mocks = buildMocks();
        const params = buildParams(adventure, hydrated, mocks);

        const result = await handleStreamResponse(params);

        expect(params.getNativeStreamCompletion.handle).toHaveBeenCalledWith(expect.objectContaining({
            connectionId: 'connection-new',
            modelId: 'model-new'
        }));
        expect(result).toBe(mocks.finalAdventure);
    });

    it('returns null without calling the text or stream controllers when the adventure id diverges', async () => {
        const adventure = createAdventureHelper({ id: 'adventure-2' });
        const hydrated = createHydratedAdventureHelper();
        const mocks = buildMocks();
        const params = buildParams(adventure, hydrated, mocks);

        const result = await handleStreamResponse(params);

        expect(result).toBeNull();
        expect(params.getAdventureText.handle).not.toHaveBeenCalled();
        expect(params.getNativeStreamCompletion.handle).not.toHaveBeenCalled();
        expect(params.startStreamingChat.handle).not.toHaveBeenCalled();
    });

    it('removes the empty assistant chat and returns the trimmed adventure', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const hydrated = createHydratedAdventureHelper({ adventure });
        const mocks = buildMocks([]);
        const params = buildParams(adventure, hydrated, mocks);

        const result = await handleStreamResponse(params);

        expect(params.deleteChatAdventure.handle).toHaveBeenCalledWith({
            adventure: expect.objectContaining({ id: 'adventure-1' }),
            chatId: 'chat-1',
            index: 0
        });
        expect(result).toBe(mocks.removedAdventure);
        expect(params.updateStreamingChat.handle).not.toHaveBeenCalled();
        expect(params.finishStreamingChat.handle).not.toHaveBeenCalled();
    });

    it('alerts and returns null when the native stream fails to start', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const hydrated = createHydratedAdventureHelper({ adventure });
        const mocks = buildMocks();
        mocks.getNativeStreamCompletion.handle.mockResolvedValue({
            success: false,
            error: 'model unavailable'
        });
        const params = buildParams(adventure, hydrated, mocks);

        const result = await handleStreamResponse(params);

        expect(result).toBeNull();
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'model unavailable' });
        expect(params.setIsStreaming).not.toHaveBeenCalled();
        expect(params.startStreamingChat.handle).not.toHaveBeenCalled();
    });

    it('alerts and returns null when the adventure text generation fails', async () => {
        const adventure = createAdventureHelper({ worldMasterId: '1' });
        const hydrated = createHydratedAdventureHelper({ adventure });
        const mocks = buildMocks();
        mocks.getAdventureText.handle.mockResolvedValue({
            success: false,
            error: 'prompt failed'
        });
        const params = buildParams(adventure, hydrated, mocks);

        const result = await handleStreamResponse(params);

        expect(result).toBeNull();
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'prompt failed' });
        expect(params.getNativeStreamCompletion.handle).not.toHaveBeenCalled();
    });
});

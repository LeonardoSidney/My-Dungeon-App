import { StartStreamingChatService } from '@application/services';
import { RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

function buildService () {
    return new StartStreamingChatService(logger, { generate: jest.fn().mockReturnValue('chat-new') });
}

describe('StartStreamingChatService', () => {
    it('appends a new streaming chat that records the model generating it', () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper()] });

        const response = buildService().startStreamingChat({
            adventure,
            role: RoleEnum.ASSISTANT,
            characterId: 'narrator',
            modelId: 'qwen3',
        });

        expect(response.success).toBe(true);
        expect(response.chat).toEqual(expect.objectContaining({
            id: 'chat-new',
            role: RoleEnum.ASSISTANT,
            content: [''],
            characterId: 'narrator',
            modelId: 'qwen3',
            isStreaming: true,
        }));
        expect(response.adventure?.chat.map(chat => chat.id)).toEqual(['chat-1', 'chat-new']);
        expect(response.adventure?.updatedAt).toBe(response.chat?.createdAt);
    });

    it('streams into an existing chat and records the model of the new generation', () => {
        const existing = createChatHelper({ id: 'chat-1', role: RoleEnum.ASSISTANT, modelId: 'llama4' });
        const other = createChatHelper({ id: 'chat-0' });
        const adventure = createAdventureHelper({ chat: [other, existing] });

        const response = buildService().startStreamingChat({
            adventure,
            role: RoleEnum.ASSISTANT,
            characterId: 'narrator',
            chatId: 'chat-1',
            modelId: 'qwen3',
        });

        expect(response.chat).toEqual(expect.objectContaining({ id: 'chat-1', modelId: 'qwen3', isStreaming: true }));
        expect(response.adventure?.chat).toEqual([other, response.chat]);
    });

    it('keeps the model already recorded when the new generation does not say which one', () => {
        const existing = createChatHelper({ id: 'chat-1', role: RoleEnum.ASSISTANT, modelId: 'llama4' });

        const response = buildService().startStreamingChat({
            adventure: createAdventureHelper({ chat: [existing] }),
            role: RoleEnum.ASSISTANT,
            characterId: 'narrator',
            chatId: 'chat-1',
        });

        expect(response.chat?.modelId).toBe('llama4');
    });

    it('fails when the chat to stream into is not in the adventure', () => {
        const response = buildService().startStreamingChat({
            adventure: createAdventureHelper(),
            role: RoleEnum.ASSISTANT,
            characterId: 'narrator',
            chatId: 'missing',
        });

        expect(response).toEqual({ success: false, error: 'Chat not found in adventure' });
    });
});

import {
    DeleteChatAdventureService,
    DeleteChatVersionService,
    FinishStreamingChatService,
    RecoverInterruptedChatsService,
} from '@application/services';
import { RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

function buildService () {
    return new RecoverInterruptedChatsService(
        logger,
        new FinishStreamingChatService(logger),
        new DeleteChatVersionService(logger),
        new DeleteChatAdventureService(logger)
    );
}

function assistantChat (overrides: Parameters<typeof createChatHelper>[0] = {}) {
    return createChatHelper({ id: 'reply', role: RoleEnum.ASSISTANT, isStreaming: true, ...overrides });
}

describe('RecoverInterruptedChatsService', () => {
    it('finishes an interrupted chat that already has generated text', () => {
        const user = createChatHelper({ id: 'user' });
        const adventure = createAdventureHelper({ chat: [user, assistantChat({ content: ['partial answer'] })] });

        const response = buildService().recover({ adventure });

        expect(response.success).toBe(true);
        expect(response.recoveredChatIds).toEqual(['reply']);
        expect(response.adventure!.chat).toEqual([
            user,
            expect.objectContaining({ id: 'reply', content: ['partial answer'], isStreaming: false })
        ]);
    });

    it('keeps an interrupted chat that only produced a think', () => {
        const adventure = createAdventureHelper({
            chat: [assistantChat({ content: [''], think: [{ id: 'think-1', content: 'reasoning', enabled: true }] })]
        });

        const response = buildService().recover({ adventure });

        expect(response.adventure!.chat).toEqual([expect.objectContaining({ id: 'reply', isStreaming: false })]);
    });

    it('removes only the empty version when the interrupted chat has older versions', () => {
        const adventure = createAdventureHelper({ chat: [assistantChat({ content: ['kept answer', ''], index: 1 })] });

        const response = buildService().recover({ adventure });

        expect(response.adventure!.chat).toEqual([
            expect.objectContaining({ id: 'reply', content: ['kept answer'], index: 0, isStreaming: false })
        ]);
    });

    it('removes an interrupted chat that never received text', () => {
        const user = createChatHelper({ id: 'user' });
        const adventure = createAdventureHelper({ chat: [user, assistantChat({ content: ['   '] })] });

        const response = buildService().recover({ adventure });

        expect(response.adventure!.chat).toEqual([user]);
        expect(response.recoveredChatIds).toEqual(['reply']);
    });

    it('leaves an adventure without interrupted chats untouched', () => {
        const adventure = createAdventureHelper({ chat: [createChatHelper({ id: 'user' })] });

        const response = buildService().recover({ adventure });

        expect(response).toEqual({ success: true, adventure, recoveredChatIds: [] });
    });

    it('fails when one of the repairs fails', () => {
        const failingFinish = { finishStreamingChat: jest.fn().mockReturnValue({ success: false, error: 'Chat not found in adventure' }) };
        const service = new RecoverInterruptedChatsService(logger, failingFinish, new DeleteChatVersionService(logger), new DeleteChatAdventureService(logger));
        const adventure = createAdventureHelper({ chat: [assistantChat({ content: ['partial'] })] });

        const response = service.recover({ adventure });

        expect(response).toEqual({ success: false, error: 'Chat not found in adventure' });
    });

    it('falls back to a generic error when a repair fails without a message', () => {
        const failingFinish = { finishStreamingChat: jest.fn().mockReturnValue({ success: false }) };
        const service = new RecoverInterruptedChatsService(logger, failingFinish, new DeleteChatVersionService(logger), new DeleteChatAdventureService(logger));
        const adventure = createAdventureHelper({ chat: [assistantChat({ content: ['partial'] })] });

        const response = service.recover({ adventure });

        expect(response).toEqual({ success: false, error: 'Failed to recover chat reply' });
    });

    it('fails without finishing the chat when removing the empty version fails', () => {
        const finish = { finishStreamingChat: jest.fn() };
        const failingDeleteVersion = { deleteVersion: jest.fn().mockReturnValue({ success: false, error: 'Version not found' }) };
        const service = new RecoverInterruptedChatsService(logger, finish, failingDeleteVersion, new DeleteChatAdventureService(logger));
        const adventure = createAdventureHelper({ chat: [assistantChat({ content: ['kept answer', ''], index: 1 })] });

        const response = service.recover({ adventure });

        expect(response).toEqual({ success: false, error: 'Version not found' });
        expect(finish.finishStreamingChat).not.toHaveBeenCalled();
    });

    it('treats a selected version that does not exist as empty', () => {
        const user = createChatHelper({ id: 'user' });
        const adventure = createAdventureHelper({ chat: [user, assistantChat({ content: [], index: 0 })] });

        const response = buildService().recover({ adventure });

        expect(response.adventure!.chat).toEqual([user]);
    });
});

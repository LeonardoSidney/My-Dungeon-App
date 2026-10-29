import { ChatMessageView } from '@domain/controllers';
import { RoleEnum } from '@domain/entities';
import {
    handleChatReplyUpdate,
    handleReplyAction,
    navigateVersion,
    requestChatReply,
    upsertChatMessage,
} from '@presentation/screens/adventures/chat/chatActions';

function createMessage (id: string, content: string): ChatMessageView {
    return {
        id,
        role: RoleEnum.ASSISTANT,
        characterId: '1',
        content,
        contentIndex: 0,
        contentCount: 1,
        isStreaming: false
    };
}

describe('requestChatReply', () => {
    function buildParams (response: Record<string, unknown>) {
        return {
            adventureId: 'adventure-1',
            generateChatReply: { handle: jest.fn().mockResolvedValue(response) },
            reloadMessages: jest.fn().mockResolvedValue(undefined),
            alert: { handle: jest.fn() }
        };
    }

    it('asks the backend for a reply and reloads the messages it already saved', async () => {
        const params = buildParams({ success: true, chatId: 'chat-1' });

        await requestChatReply({ ...params, replyChatId: 'chat-1' });

        expect(params.generateChatReply.handle).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(params.reloadMessages).toHaveBeenCalled();
        expect(params.alert.handle).not.toHaveBeenCalled();
    });

    it('alerts with the backend error and still reloads what was saved before the failure', async () => {
        const params = buildParams({ success: false, error: 'model unavailable' });

        await requestChatReply(params);

        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'model unavailable' });
        expect(params.reloadMessages).toHaveBeenCalled();
    });
});

describe('handleChatReplyUpdate', () => {
    function buildParams (update: { chatId: string; isFinished: boolean; isRemoved: boolean; error?: string; }) {
        return {
            update,
            reloadMessage: jest.fn().mockResolvedValue(undefined),
            reloadMessages: jest.fn().mockResolvedValue(undefined),
            setIsReplying: jest.fn(),
            alert: { handle: jest.fn() }
        };
    }

    it('reloads only the updated chat while the reply streams', async () => {
        const params = buildParams({ chatId: 'chat-1', isFinished: false, isRemoved: false });

        await handleChatReplyUpdate(params);

        expect(params.reloadMessage).toHaveBeenCalledWith('chat-1');
        expect(params.reloadMessages).not.toHaveBeenCalled();
        expect(params.setIsReplying).toHaveBeenCalledWith(true);
    });

    it('marks the reply as done and reloads every message of the turn when it finishes', async () => {
        const params = buildParams({ chatId: 'chat-1', isFinished: true, isRemoved: false });

        await handleChatReplyUpdate(params);

        expect(params.reloadMessages).toHaveBeenCalled();
        expect(params.reloadMessage).not.toHaveBeenCalled();
        expect(params.setIsReplying).toHaveBeenCalledWith(false);
    });

    it('reloads every message when the reply chat was removed', async () => {
        const params = buildParams({ chatId: 'chat-1', isFinished: true, isRemoved: true });

        await handleChatReplyUpdate(params);

        expect(params.reloadMessages).toHaveBeenCalled();
        expect(params.reloadMessage).not.toHaveBeenCalled();
    });

    it('alerts with the error the backend reported', async () => {
        const params = buildParams({ chatId: 'chat-1', isFinished: true, isRemoved: false, error: 'Request failed with status 500' });

        await handleChatReplyUpdate(params);

        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'Request failed with status 500' });
    });
});

describe('upsertChatMessage', () => {
    it('replaces the message with the same id in place', () => {
        const messages = [createMessage('chat-1', 'user'), createMessage('chat-2', 'Hel')];

        const next = upsertChatMessage(messages, createMessage('chat-2', 'Hello'));

        expect(next).toEqual([createMessage('chat-1', 'user'), createMessage('chat-2', 'Hello')]);
        expect(messages[1].content).toBe('Hel');
    });

    it('appends a message that is not in the list yet', () => {
        const next = upsertChatMessage([createMessage('chat-1', 'user')], createMessage('chat-2', 'Hi'));

        expect(next.map(message => message.id)).toEqual(['chat-1', 'chat-2']);
    });
});

describe('handleReplyAction', () => {
    it('streams the reply into the chat id the backend answered with', async () => {
        const streamReply = jest.fn().mockResolvedValue(undefined);
        const alert = { handle: jest.fn() };

        await handleReplyAction({
            prepare: jest.fn().mockResolvedValue({ success: true, replyChatId: 'assistant-1' }),
            fallbackError: 'Failed',
            streamReply,
            alert,
        });

        expect(streamReply).toHaveBeenCalledWith('assistant-1');
        expect(alert.handle).not.toHaveBeenCalled();
    });

    it('alerts and does not stream when the command fails', async () => {
        const streamReply = jest.fn();
        const alert = { handle: jest.fn() };

        await handleReplyAction({
            prepare: jest.fn().mockResolvedValue({ success: false, error: 'No user message' }),
            fallbackError: 'Failed',
            streamReply,
            alert,
        });

        expect(alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'No user message' });
        expect(streamReply).not.toHaveBeenCalled();
    });
});

describe('navigateVersion', () => {
    it.each(['content', 'think'] as const)('sends only the direction for %s versions and re-reads the messages', async (kind) => {
        const selectChatVersion = { handle: jest.fn().mockResolvedValue({ success: true }) };
        const reloadMessages = jest.fn().mockResolvedValue(undefined);

        await navigateVersion({ adventureId: 'adventure-1', chatId: 'chat-1', kind, direction: 1, reloadMessages, selectChatVersion });

        expect(selectChatVersion.handle).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1', direction: 1, kind });
        expect(reloadMessages).toHaveBeenCalled();
    });

    it('does not re-read the messages when the backend rejects the selection', async () => {
        const selectChatVersion = { handle: jest.fn().mockResolvedValue({ success: false, error: 'not found' }) };
        const reloadMessages = jest.fn();

        await navigateVersion({ adventureId: 'adventure-1', chatId: 'chat-1', kind: 'content', direction: -1, reloadMessages, selectChatVersion });

        expect(reloadMessages).not.toHaveBeenCalled();
    });
});

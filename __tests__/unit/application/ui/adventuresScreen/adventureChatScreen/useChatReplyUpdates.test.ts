import { act, renderHook, waitFor } from '@testing-library/react-native';
import { ChatMessageView, ChatReplyUpdateView } from '@domain/controllers';
import { RoleEnum } from '@domain/entities';
import { useChatReplyUpdates } from '@application/ui/adventuresScreen/adventureChatScreen/hooks/useChatReplyUpdates';

function createMessage (id: string, content: string, isStreaming = true): ChatMessageView {
    return {
        id,
        role: RoleEnum.ASSISTANT,
        characterId: '1',
        content,
        contentIndex: 0,
        contentCount: 1,
        isStreaming
    };
}

async function setup (isReplying = false) {
    let onUpdate: (update: ChatReplyUpdateView) => void = () => undefined;
    const unsubscribe = jest.fn();
    let messages: ChatMessageView[] = [createMessage('chat-1', 'user', false)];
    const params = {
        adventureId: 'adventure-1',
        subscribeChatReply: {
            handle: jest.fn((request: { onUpdate: (update: ChatReplyUpdateView) => void; }) => {
                onUpdate = request.onUpdate;
                return { success: true, isReplying, unsubscribe };
            })
        },
        getChatMessage: { handle: jest.fn() },
        getChatMessages: { handle: jest.fn().mockResolvedValue({ success: true, messages: [createMessage('chat-1', 'reloaded', false)] }) },
        setMessages: jest.fn((next: ChatMessageView[]) => { messages = next; }),
        updateMessages: jest.fn((update: (current: ChatMessageView[]) => ChatMessageView[]) => { messages = update(messages); }),
        alert: { handle: jest.fn() }
    };

    const hook = await renderHook(() => useChatReplyUpdates(params));

    return { ...hook, params, unsubscribe, emit: (update: ChatReplyUpdateView) => act(async () => { onUpdate(update); }), messages: () => messages };
}

describe('useChatReplyUpdates', () => {
    it('starts as replying when the backend is already generating for the adventure', async () => {
        const { result, params } = await setup(true);

        expect(params.subscribeChatReply.handle).toHaveBeenCalledWith(expect.objectContaining({ adventureId: 'adventure-1' }));
        expect(result.current.isReplying).toBe(true);
    });

    it('fetches the updated chat and merges it into the messages', async () => {
        const { result, params, emit, messages } = await setup();
        params.getChatMessage.handle.mockResolvedValue({ success: true, message: createMessage('chat-2', 'Hel') });

        await emit({ chatId: 'chat-2', isFinished: false, isRemoved: false });

        await waitFor(() => expect(messages().map(message => message.content)).toEqual(['user', 'Hel']));
        expect(params.getChatMessage.handle).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-2' });
        expect(result.current.isReplying).toBe(true);
    });

    it('ignores a slower fetch that resolves after a newer one', async () => {
        const { params, emit, messages } = await setup();
        let resolveSlow: (value: unknown) => void = () => undefined;
        params.getChatMessage.handle
            .mockReturnValueOnce(new Promise(resolve => { resolveSlow = resolve; }))
            .mockResolvedValueOnce({ success: true, message: createMessage('chat-2', 'Hello', false) });

        await emit({ chatId: 'chat-2', isFinished: false, isRemoved: false });
        await emit({ chatId: 'chat-2', isFinished: true, isRemoved: false });
        await waitFor(() => expect(messages()[1]?.content).toBe('Hello'));
        await act(async () => { resolveSlow({ success: true, message: createMessage('chat-2', 'Hel') }); });

        expect(messages()[1].content).toBe('Hello');
    });

    it('reloads every message when the chat cannot be fetched', async () => {
        const { params, emit } = await setup();
        params.getChatMessage.handle.mockResolvedValue({ success: false, error: 'Chat with id chat-2 not found' });

        await emit({ chatId: 'chat-2', isFinished: false, isRemoved: false });

        await waitFor(() => expect(params.setMessages).toHaveBeenCalledWith([createMessage('chat-1', 'reloaded', false)]));
    });

    it('stops replying and alerts when the reply finishes with an error', async () => {
        const { result, params, emit } = await setup(true);
        params.getChatMessage.handle.mockResolvedValue({ success: true, message: createMessage('chat-2', 'partial', false) });

        await emit({ chatId: 'chat-2', isFinished: true, isRemoved: false, error: 'Request failed with status 500' });

        expect(result.current.isReplying).toBe(false);
        expect(params.alert.handle).toHaveBeenCalledWith({ title: 'Erro', message: 'Request failed with status 500' });
    });

    it('unsubscribes when the screen unmounts', async () => {
        const { unmount, unsubscribe } = await setup();

        await unmount();

        expect(unsubscribe).toHaveBeenCalled();
    });
});

import { act, renderHook } from '@testing-library/react-native';
import { ChatMessageView, ChatThinkView } from '@domain/controllers';
import { AlertActionStyleEnum, AlertUseCaseParams } from '@domain/use-cases';
import { useMessageActions } from '@presentation/screens/adventures/chat/hooks/useMessageActions';

type HookParams = Parameters<typeof useMessageActions>[0];

const message = { id: 'chat-1', content: 'Hello', contentCount: 1, contentIndex: 0 } as ChatMessageView;
const versionedMessage = { ...message, contentCount: 2, contentIndex: 1 };
const think = { index: 1 } as ChatThinkView;

function buildParams () {
    const handleAlert = jest.fn<void, [AlertUseCaseParams]>();
    const deleteChatAdventure = { handle: jest.fn().mockResolvedValue({ success: true }) };
    const deleteChatVersion = { handle: jest.fn().mockResolvedValue({ success: true }) };
    const deleteThinkVersion = { handle: jest.fn().mockResolvedValue({ success: true }) };
    const params = {
        adventureId: 'adventure-1',
        reloadMessages: jest.fn().mockResolvedValue(undefined),
        streamReply: jest.fn().mockResolvedValue(undefined),
        setEditingChatId: jest.fn(),
        setEditingThinkChatId: jest.fn(),
        setComposerMessage: jest.fn(),
        controllers: { alert: { handle: handleAlert }, deleteChatAdventure, deleteChatVersion, deleteThinkVersion } as unknown as HookParams['controllers'],
    };
    const confirm = () => act(async () => {
        await handleAlert.mock.calls[0][0].actions?.find(action => action.style === AlertActionStyleEnum.DESTRUCTIVE)?.onPress?.();
    });
    return { params, handleAlert, deleteChatAdventure, deleteChatVersion, deleteThinkVersion, confirm };
}

describe('useMessageActions delete confirmation', () => {
    it('asks before deleting a message', async () => {
        const { params, handleAlert, deleteChatAdventure } = buildParams();
        const { result } = await renderHook(() => useMessageActions(params));

        result.current.deleteMessage(message);

        expect(handleAlert.mock.calls[0][0].title).toBe('Delete this message?');
        expect(deleteChatAdventure.handle).not.toHaveBeenCalled();
    });

    it('deletes the message and gives its text back to the composer once confirmed', async () => {
        const { params, deleteChatAdventure, confirm } = buildParams();
        const { result } = await renderHook(() => useMessageActions(params));

        result.current.deleteMessage(message);
        await confirm();

        expect(deleteChatAdventure.handle).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1' });
        expect(params.setComposerMessage).toHaveBeenCalledWith('Hello');
        expect(params.reloadMessages).toHaveBeenCalledTimes(1);
    });

    it('asks about the version when the message has other versions', async () => {
        const { params, handleAlert } = buildParams();
        const { result } = await renderHook(() => useMessageActions(params));

        result.current.deleteMessage(versionedMessage);

        expect(handleAlert.mock.calls[0][0].title).toBe('Delete this version?');
    });

    it('deletes only the version once confirmed', async () => {
        const { params, deleteChatAdventure, deleteChatVersion, confirm } = buildParams();
        const { result } = await renderHook(() => useMessageActions(params));

        result.current.deleteMessage(versionedMessage);
        await confirm();

        expect(deleteChatVersion.handle).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1', versionIndex: 1 });
        expect(deleteChatAdventure.handle).not.toHaveBeenCalled();
        expect(params.setComposerMessage).not.toHaveBeenCalled();
    });

    it('shows the error when the message cannot be deleted', async () => {
        const { params, handleAlert, deleteChatAdventure, confirm } = buildParams();
        deleteChatAdventure.handle.mockResolvedValue({ success: false, error: 'Storage is full' });
        const { result } = await renderHook(() => useMessageActions(params));

        result.current.deleteMessage(message);
        await confirm();

        expect(handleAlert.mock.calls[1][0].message).toBe('Storage is full');
        expect(params.reloadMessages).not.toHaveBeenCalled();
    });

    it('asks before deleting a thought', async () => {
        const { params, handleAlert, deleteThinkVersion } = buildParams();
        const { result } = await renderHook(() => useMessageActions(params));

        result.current.deleteThink('chat-1', think);

        expect(handleAlert.mock.calls[0][0].title).toBe('Delete this thought?');
        expect(deleteThinkVersion.handle).not.toHaveBeenCalled();
    });

    it('deletes the thought once confirmed', async () => {
        const { params, deleteThinkVersion, confirm } = buildParams();
        const { result } = await renderHook(() => useMessageActions(params));

        result.current.deleteThink('chat-1', think);
        await confirm();

        expect(deleteThinkVersion.handle).toHaveBeenCalledWith({ adventureId: 'adventure-1', chatId: 'chat-1', versionIndex: 1 });
        expect(params.reloadMessages).toHaveBeenCalledTimes(1);
    });

    it('shows the error when the thought cannot be deleted', async () => {
        const { params, handleAlert, deleteThinkVersion, confirm } = buildParams();
        deleteThinkVersion.handle.mockResolvedValue({ success: false, error: 'Storage is full' });
        const { result } = await renderHook(() => useMessageActions(params));

        result.current.deleteThink('chat-1', think);
        await confirm();

        expect(handleAlert.mock.calls[1][0].message).toBe('Storage is full');
        expect(params.reloadMessages).not.toHaveBeenCalled();
    });
});

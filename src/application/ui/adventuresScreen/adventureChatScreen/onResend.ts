import { OnResendParams } from './constants';

export async function onResend ({ adventureId, setMessage, streamReply, editingChatIdRef, message, clearEditing, addChatVersion, resendChat, alert }: OnResendParams) {
    const editingChatId = editingChatIdRef?.current ?? null;

    if (editingChatId && message.trim()) {
        const response = await addChatVersion.handle({
            adventureId,
            chatId: editingChatId,
            content: message,
        });

        if (!response.success) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to save message edit' });
            return;
        }
    }

    if (editingChatId) {
        clearEditing();
        setMessage('');
    }

    const response = await resendChat.handle({ adventureId });

    if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to resend message' });
        return;
    }

    await streamReply();
}

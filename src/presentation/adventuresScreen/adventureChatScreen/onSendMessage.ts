import { OnSendMessageParams } from './constants';

export async function onSendMessage ({
    adventureId,
    message,
    selectedCharacter,
    reloadMessages,
    setMessage,
    streamReply,
    appendChatAdventure,
    addChatVersion,
    editingChatIdRef,
    clearEditing,
    alert,
}: OnSendMessageParams) {
    if (editingChatIdRef.current) {
        if (!message.trim()) {
            setMessage('');
            clearEditing();
            return;
        }

        const response = await addChatVersion.handle({
            adventureId,
            chatId: editingChatIdRef.current,
            content: message,
        });

        if (!response.success) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to save message edit' });
            return;
        }

        setMessage('');
        clearEditing();
        await reloadMessages();
        return;
    }

    if (!message.trim()) return;

    const response = await appendChatAdventure.handle({
        adventureId,
        characterId: selectedCharacter.id,
        content: message,
    });

    if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to send message' });
        return;
    }

    setMessage('');
    await streamReply();
}

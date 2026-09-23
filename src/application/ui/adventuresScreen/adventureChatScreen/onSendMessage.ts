import { RoleEnum } from '@domain/entities';
import { OnSendMessageParams } from './constants';

export async function onSendMessage ({
    message,
    selectedCharacter,
    currentAdventure,
    setCurrentAdventure,
    setMessage,
    handleStreamResponse,
    createChatAdventure,
    appendChatAdventure,
    editChatAdventure,
    editingChatIdRef,
    clearEditing,
    alert,
}: OnSendMessageParams) {
    if (editingChatIdRef.current) {
        const chat = currentAdventure.chat.find(c => c.id === editingChatIdRef.current);
        if (!chat) {
            clearEditing();
            return;
        }

        if (!message.trim()) {
            setMessage('');
            clearEditing();
            return;
        }

        const response = await editChatAdventure.handle({
            adventure: currentAdventure,
            chatId: chat.id,
            content: message,
            role: chat.role,
            characterId: chat.characterId,
        });

        if (!response.success || !response.adventure) {
            alert.handle({ title: 'Erro', message: response.error ?? 'Failed to save message edit' });
            return;
        }

        setCurrentAdventure(response.adventure);
        setMessage('');
        clearEditing();
        return;
    }

    if (!message.trim()) return;

    const chatResponse = await createChatAdventure.handle({
        content: message,
        role: RoleEnum.USER,
        characterId: selectedCharacter.id,
    });

    if (!chatResponse.success || !chatResponse.chat) {
        alert.handle({ title: 'Erro', message: chatResponse.error ?? 'Failed to create chat message' });
        return;
    }

    const appendResponse = await appendChatAdventure.handle({
        adventure: currentAdventure,
        message: chatResponse.chat,
    });

    if (!appendResponse.success || !appendResponse.adventure) {
        alert.handle({ title: 'Erro', message: appendResponse.error ?? 'Failed to append chat to adventure' });
        return;
    }

    setCurrentAdventure(appendResponse.adventure);
    setMessage('');
    await handleStreamResponse(appendResponse.adventure);
}

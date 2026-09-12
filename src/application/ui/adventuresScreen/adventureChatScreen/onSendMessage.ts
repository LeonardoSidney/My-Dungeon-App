import { Alert } from 'react-native';
import { RoleEnum } from '@domain/entities';
import { buildEditedAdventure } from './handleEditMessage';
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
    editingChatIdRef,
    clearEditing,
}: OnSendMessageParams) {
    if (!message.trim()) return;

    if (editingChatIdRef.current) {
        const updatedAdventure = buildEditedAdventure(currentAdventure, editingChatIdRef.current, message);
        setCurrentAdventure(updatedAdventure);
        setMessage('');
        clearEditing();
        return;
    }

    const chatResponse = await createChatAdventure.handle({
        content: message,
        role: RoleEnum.USER,
        characterId: selectedCharacter.id,
    });

    if (!chatResponse.success || !chatResponse.chat) {
        Alert.alert('Erro', chatResponse.error ?? 'Failed to create chat message');
        return;
    }

    const appendResponse = await appendChatAdventure.handle({
        adventure: currentAdventure,
        message: chatResponse.chat,
    });

    if (!appendResponse.success || !appendResponse.adventure) {
        Alert.alert('Erro', appendResponse.error ?? 'Failed to append chat to adventure');
        return;
    }

    setCurrentAdventure(appendResponse.adventure);
    setMessage('');
    await handleStreamResponse(appendResponse.adventure);
}

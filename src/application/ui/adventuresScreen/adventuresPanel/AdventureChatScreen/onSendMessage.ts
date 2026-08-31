import { Alert } from 'react-native';
import { RoleEnum } from '@domain/entities';
import { createChatAdventureController, appendChatAdventureController } from '@infra/container';
import { OnSendMessageParams } from './constants';

export async function onSendMessage ({
    message,
    selectedCharacter,
    currentAdventure,
    setCurrentAdventure,
    setMessage,
    handleStreamResponse,
}: OnSendMessageParams) {
    if (!message.trim()) return;

    const chatController = createChatAdventureController();
    const chatResponse = await chatController.handle({
        content: message,
        role: RoleEnum.USER,
        characterId: selectedCharacter.id,
    });

    if (!chatResponse.success || !chatResponse.chat) {
        Alert.alert('Erro', chatResponse.error ?? 'Failed to create chat message');
        return;
    }

    const appendController = appendChatAdventureController();
    const appendResponse = await appendController.handle({
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

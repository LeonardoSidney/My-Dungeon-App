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
        characterName: selectedCharacter.name,
    });

    if (chatResponse.success && chatResponse.chat) {
        const appendController = appendChatAdventureController();
        const appendResponse = await appendController.handle({
            adventure: currentAdventure,
            message: chatResponse.chat,
        });

        if (appendResponse.success && appendResponse.adventure) {
            setCurrentAdventure(appendResponse.adventure);
            setMessage('');
            await handleStreamResponse(appendResponse.adventure);
        }
    }
}

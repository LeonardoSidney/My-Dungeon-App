import { RoleEnum } from '@domain/entities';
import { OnResendParams } from './constants';

export async function onResend ({ currentAdventure, setCurrentAdventure, setMessage, handleStreamResponse, editingChatIdRef, message, clearEditing, editChatAdventure, resendChat, alert }: OnResendParams) {
    if (!currentAdventure.chat || currentAdventure.chat.length === 0) {
        alert.handle({ title: 'Erro', message: 'No chat history to resend' });
        return;
    }

    const editingChatId = editingChatIdRef?.current ?? null;
    let adventureToResend = currentAdventure;

    if (editingChatId && message.trim()) {
        const chat = currentAdventure.chat.find(c => c.id === editingChatId);
        if (chat) {
            const response = await editChatAdventure.handle({
                adventure: currentAdventure,
                chatId: chat.id,
                content: message,
                role: chat.role,
                characterId: chat.characterId,
            });

            if (response.success && response.adventure) {
                adventureToResend = response.adventure;
                setCurrentAdventure(response.adventure);
            }
        }
    }

    if (editingChatId) {
        clearEditing();
        setMessage('');
    }

    const lastChat = adventureToResend.chat[adventureToResend.chat.length - 1];
    const response = await resendChat.handle({ adventure: adventureToResend, chatId: lastChat.id });

    if (!response.success || !response.adventure) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to resend message' });
        return;
    }

    const updatedChats = response.adventure.chat;
    setCurrentAdventure(response.adventure);

    const lastUserChat = [...updatedChats].reverse().find(c => c.role === RoleEnum.USER);
    if (!lastUserChat) return;

    await handleStreamResponse(response.adventure);
}

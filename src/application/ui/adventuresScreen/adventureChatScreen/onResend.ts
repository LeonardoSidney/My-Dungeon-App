import { RoleEnum } from '@domain/entities';
import { buildEditedAdventure } from './handleEditMessage';
import { OnResendParams } from './constants';

export async function onResend ({ currentAdventure, setCurrentAdventure, setMessage, handleStreamResponse, editingChatIdRef, message, clearEditing }: OnResendParams) {
    if (!currentAdventure.chat || currentAdventure.chat.length === 0) return;

    const editingChatId = editingChatIdRef?.current ?? null;
    let adventureToResend = currentAdventure;

    if (editingChatId && message.trim()) {
        adventureToResend = buildEditedAdventure(currentAdventure, editingChatId, message);
        setCurrentAdventure(adventureToResend);
    }

    if (editingChatId) {
        clearEditing();
        setMessage('');
    }

    const updatedChats = adventureToResend.chat.slice(0, -1);
    const updatedAdventure = { ...adventureToResend, chat: updatedChats };
    setCurrentAdventure(updatedAdventure);

    const lastUserChat = [...updatedChats].reverse().find(c => c.role === RoleEnum.USER);
    if (!lastUserChat) return;

    await handleStreamResponse(updatedAdventure);
}

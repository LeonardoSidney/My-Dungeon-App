import { RoleEnum } from '@domain/entities';
import { OnResendParams } from './constants';

export async function onResend ({ currentAdventure, setCurrentAdventure, handleStreamResponse }: OnResendParams) {
    if (!currentAdventure.chat || currentAdventure.chat.length === 0) return;

    const updatedChats = currentAdventure.chat.slice(0, -1);
    const updatedAdventure = { ...currentAdventure, chat: updatedChats };
    setCurrentAdventure(updatedAdventure);

    const lastUserChat = [...updatedChats].reverse().find(c => c.role === RoleEnum.USER);
    if (!lastUserChat) return;

    await handleStreamResponse(updatedAdventure);
}

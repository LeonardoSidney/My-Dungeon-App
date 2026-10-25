import { HandleChatReplyUpdateParams } from './constants';

export async function handleChatReplyUpdate ({
    update,
    reloadMessage,
    reloadMessages,
    setIsReplying,
    alert,
}: HandleChatReplyUpdateParams): Promise<void> {
    setIsReplying(!update.isFinished);

    if (update.error) {
        alert.handle({ title: 'Erro', message: update.error });
    }

    if (update.isRemoved) {
        await reloadMessages();
        return;
    }

    await reloadMessage(update.chatId);
}

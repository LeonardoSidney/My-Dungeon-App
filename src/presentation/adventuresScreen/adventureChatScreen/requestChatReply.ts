import { RequestChatReplyParams } from './constants';

export async function requestChatReply ({
    adventureId,
    replyChatId,
    generateChatReply,
    reloadMessages,
    alert,
}: RequestChatReplyParams): Promise<void> {
    const response = await generateChatReply.handle({ adventureId, chatId: replyChatId });

    if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to generate the assistant reply' });
    }

    await reloadMessages();
}

import { HandleReplyActionParams } from './constants';

export async function handleReplyAction ({
    prepare,
    fallbackError,
    streamReply,
    alert,
}: HandleReplyActionParams): Promise<void> {
    const response = await prepare();

    if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? fallbackError });
        return;
    }

    await streamReply(response.replyChatId);
}

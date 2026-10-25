import { ChatMessageView } from '@domain/controllers';

export function upsertChatMessage (messages: ChatMessageView[], message: ChatMessageView): ChatMessageView[] {
    const index = messages.findIndex(entry => entry.id === message.id);
    if (index === -1) {
        return [...messages, message];
    }

    const next = [...messages];
    next[index] = message;
    return next;
}

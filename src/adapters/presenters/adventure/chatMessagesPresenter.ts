import type { Chat } from '@domain/entities';
import type { ChatMessageView, ChatThinkView } from '@domain/controllers';
import { IChatMessagesPresenter } from '@domain/presenters';

export class ChatMessagesPresenter implements IChatMessagesPresenter {
    present (chats: Chat[]): ChatMessageView[] {
        return chats.map(chat => this.presentOne(chat));
    }

    presentOne (chat: Chat): ChatMessageView {
        const contentIndex = this.clampIndex(chat.index, chat.content.length);

        return {
            id: chat.id,
            role: chat.role,
            characterId: chat.characterId,
            content: chat.content[contentIndex] ?? '',
            contentIndex,
            contentCount: chat.content.length,
            think: this.toChatThinkView(chat),
            isStreaming: Boolean(chat.isStreaming),
        };
    }

    private toChatThinkView (chat: Chat): ChatThinkView | undefined {
        const think = chat.think ?? [];
        if (!think.some(entry => Boolean(entry.content))) {
            return undefined;
        }

        const index = this.clampIndex(chat.thinkIndex, think.length);
        return {
            content: think[index]?.content,
            index,
            count: think.length,
        };
    }

    private clampIndex (index: number, count: number): number {
        return Math.min(Math.max(index, 0), Math.max(0, count - 1));
    }
}

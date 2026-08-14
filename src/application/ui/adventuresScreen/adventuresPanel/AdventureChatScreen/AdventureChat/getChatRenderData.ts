import { RoleEnum } from '@domain/entities';
import { styles } from './styles';
import { GetChatRenderDataParams, ChatRenderData } from './constants';

export function getChatRenderData ({
    chat,
    streamingChatFromList,
}: GetChatRenderDataParams): Omit<ChatRenderData, 'chatContent'> & { chatContentIsStreaming: boolean; content: string } {
    const think = chat.think?.[chat.index];
    const isStreamingChat = chat === streamingChatFromList;
    const streamingThink = isStreamingChat ? streamingChatFromList?.think?.[0] : undefined;
    const thinkEnabled = Boolean(think?.enabled);
    const thinkContent = Boolean(think?.content);
    const streamingThinkEnabled = Boolean(streamingThink?.enabled);
    const streamingThinkContent = Boolean(streamingThink?.content);
    const hasThinkValue = thinkEnabled && thinkContent;
    const hasStreamingThinkValue = streamingThinkEnabled && streamingThinkContent;
    const isUserMessage = chat.role === RoleEnum.USER;
    const chatItemStyle = hasThinkValue ? styles.chatItemWithThink : styles.chatItem;
    const content = chat.content[chat.index];

    return {
        think,
        isStreamingChat,
        streamingThink,
        hasThink: hasThinkValue,
        hasStreamingThink: hasStreamingThinkValue,
        isUserMessage,
        chatItemStyle,
        chatContentIsStreaming: isStreamingChat,
        content,
    };
}

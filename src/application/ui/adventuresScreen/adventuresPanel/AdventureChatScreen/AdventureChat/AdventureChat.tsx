import { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AdventureThink } from './AdventureThink';
import { TextMarkdown } from './TextMarkdown';
import { getChatRenderData } from './getChatRenderData';
import { getStreamingChatFromList } from './getStreamingChatFromList';
import { AdventureChatProps } from './constants';

export function AdventureChat ({ chats, streamingChat, onDeleteMessage, onRegenerateFromMessage }: AdventureChatProps) {
  const streamingChatFromList = useMemo(() => getStreamingChatFromList({ streamingChat, chats }), [streamingChat, chats]);

  return (
    <View style={styles.container}>
      {chats.map(chat => {
        const renderData = getChatRenderData({ chat, streamingChatFromList });
        const { think, streamingThink, hasThink, hasStreamingThink, isUserMessage, chatItemStyle, chatContentIsStreaming, content } = renderData;
        const chatContent = chatContentIsStreaming ? (
          <Text style={styles.text}>{content}</Text>
        ) : (
          <TextMarkdown content={content} />
        );

        return (
          <View key={chat.id} style={styles.chatWrapper}>
            {hasThink && (
              <AdventureThink think={think} streamingThink={hasStreamingThink ? streamingThink : undefined} />
            )}
            <View style={chatItemStyle}>
              <Text style={styles.characterName}>{chat.characterName}</Text>
              {chatContent}
            </View>
            {isUserMessage && onDeleteMessage && (
              <View style={styles.actionsContainer}>
                {onRegenerateFromMessage && (
                  <TouchableOpacity style={styles.regenerateButton} onPress={() => onRegenerateFromMessage(chat.id)}>
                    <Text style={styles.regenerateButtonText}>↻</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteMessage(chat.id)}>
                  <Text style={styles.deleteButtonText}>🗑</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RoleEnum } from '@domain/entities';
import { styles } from '../styles';
import { AdventureThink } from '../AdventureThink';
import { TextMarkdown } from '../TextMarkdown';
import { ChatItemProps } from './constants';

function ChatItemBase ({ chat, isStreaming, onDeleteMessage, onRegenerateFromMessage }: ChatItemProps) {
  const think = chat.think?.[chat.index];
  const streamingThink = isStreaming ? chat.think?.[0] : undefined;
  const content = chat.content[chat.index];
  const isUserMessage = chat.role === RoleEnum.USER;

  const thinkEnabled = Boolean(think?.enabled);
  const hasThink = thinkEnabled && Boolean(think?.content);

  const streamingThinkEnabled = Boolean(streamingThink?.enabled);
  const hasStreamingThink = streamingThinkEnabled && Boolean(streamingThink?.content);

  const chatItemStyle = hasThink ? styles.chatItemWithThink : styles.chatItem;
  const chatContent = isStreaming ? (
    <Text style={styles.text}>{content}</Text>
  ) : (
    <TextMarkdown content={content} />
  );

  return (
    <View style={styles.chatWrapper}>
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
}

export const ChatItem = memo(ChatItemBase);

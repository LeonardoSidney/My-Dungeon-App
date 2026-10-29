import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatMessageView } from '@domain/controllers';
import { colors } from '@presentation/theme';
import type { ChatMessageActions } from '../types';
import { ChatItem } from './ChatItem';

type ChatMessageListProps = {
  messages: ChatMessageView[];
  characterNameById: Record<string, string>;
  editingChatId: string | null;
  editingThinkChatId: string | null;
  showThinkBlocks: boolean;
  actions: ChatMessageActions;
};

function ChatMessageListBase ({ messages, characterNameById, editingChatId, editingThinkChatId, showThinkBlocks, actions }: ChatMessageListProps) {
  return (
    <View style={styles.container}>
      {messages.map(message => (
        <ChatItem
          key={message.id}
          message={message}
          characterName={characterNameById[message.characterId] ?? ''}
          editingChatId={editingChatId}
          editingThinkChatId={editingThinkChatId}
          showThinkBlocks={showThinkBlocks}
          actions={actions}
        />
      ))}
    </View>
  );
}

export const ChatMessageList = memo(ChatMessageListBase);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 12,
  },
});

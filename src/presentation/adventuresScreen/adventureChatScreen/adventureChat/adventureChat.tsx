import { memo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { ChatItem } from './chatItem';
import { AdventureChatProps } from './constants';

function AdventureChatBase ({ messages, characterNameById, onDeleteMessage, isMessageEditing, editingChatId, onEditMessage, onSaveEditMessage, onDiscardEdit, onContinueFromMessage, onRegenerateFromMessage, onRegenerateContent, onNavigateChatIndex, onNavigateThinkIndex, onRegenerateFromThink, onEditThink, onSaveThinkEdit, onDiscardThinkEdit, onDeleteThink, isThinkEditing, editingThinkChatId }: AdventureChatProps) {
  return (
    <View style={styles.container}>
      {messages.map(message => (
        <ChatItem
          key={message.id}
          message={message}
          isStreaming={message.isStreaming}
          characterNameById={characterNameById}
          onDeleteMessage={onDeleteMessage}
          isMessageEditing={isMessageEditing}
          editingChatId={editingChatId}
          onEditMessage={onEditMessage}
          onSaveEditMessage={onSaveEditMessage}
          onDiscardEdit={onDiscardEdit}
          onContinueFromMessage={onContinueFromMessage}
          onRegenerateFromMessage={onRegenerateFromMessage}
          onRegenerateContent={onRegenerateContent}
          onNavigateChatIndex={onNavigateChatIndex}
          onNavigateThinkIndex={onNavigateThinkIndex}
          onRegenerateFromThink={onRegenerateFromThink}
          onEditThink={onEditThink}
          onSaveThinkEdit={onSaveThinkEdit}
          onDiscardThinkEdit={onDiscardThinkEdit}
          onDeleteThink={onDeleteThink}
          isThinkEditing={isThinkEditing}
          editingThinkChatId={editingThinkChatId}
        />
      ))}
    </View>
  );
}

export const AdventureChat = memo(AdventureChatBase);

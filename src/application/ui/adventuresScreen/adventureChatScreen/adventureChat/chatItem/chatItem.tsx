import { memo, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RoleEnum } from '@domain/entities';
import { styles } from '../styles';
import { AdventureThink } from '../adventureThink';
import { TextMarkdown } from '../textMarkdown';
import { ChatItemProps } from './constants';

function ChatItemBase ({ chat, isStreaming, characterNameById, onDeleteMessage, isMessageEditing, editingChatId, onEditMessage, onSaveEditMessage, onDiscardEdit, onContinueFromMessage, onRegenerateFromMessage }: ChatItemProps) {
  const think = chat.think?.[chat.index];
  const streamingThink = isStreaming ? chat.think?.[0] : undefined;
  const content = chat.content[chat.index];
  const isUserMessage = chat.role === RoleEnum.USER;
  const characterName = characterNameById[chat.characterId] ?? '';
  const isEditingThisMessage = !isStreaming && isMessageEditing && editingChatId === chat.id;

  const [draft, setDraft] = useState(content);

  useEffect(() => {
    if (isEditingThisMessage) setDraft(content);
  }, [isEditingThisMessage, content]);

  const showOriginalActions = !isMessageEditing;

  const canEdit = showOriginalActions && !isStreaming && Boolean(onEditMessage);
  const showContinue = !isUserMessage && showOriginalActions && !isStreaming && Boolean(onContinueFromMessage);
  const showRegenerate = isUserMessage && showOriginalActions && Boolean(onRegenerateFromMessage);
  const showDelete = isUserMessage && showOriginalActions && Boolean(onDeleteMessage);
  const showDiscard = isEditingThisMessage && Boolean(onDiscardEdit);
  const showSave = isEditingThisMessage && Boolean(onSaveEditMessage);
  const hasActions = canEdit || showContinue || showRegenerate || showDelete || showDiscard || showSave;

  const thinkEnabled = Boolean(think?.enabled);
  const hasThink = thinkEnabled && Boolean(think?.content);

  const streamingThinkEnabled = Boolean(streamingThink?.enabled);
  const hasStreamingThink = streamingThinkEnabled && Boolean(streamingThink?.content);

  const chatItemStyle = hasThink ? styles.chatItemWithThink : styles.chatItem;
  const streamingContent = (
    <Text style={styles.text}>{content}</Text>
  );
  const markdownContent = (
    <TextMarkdown content={content} />
  );
  const editingContent = (
    <TextInput
      style={styles.editInput}
      value={draft}
      onChangeText={setDraft}
      multiline
      textAlignVertical="top"
      selectionColor="transparent"
    />
  );
  const chatContent = isStreaming ? streamingContent : (isEditingThisMessage ? editingContent : markdownContent);

  return (
    <View style={styles.chatWrapper}>
      {hasThink && (
        <AdventureThink think={think} streamingThink={hasStreamingThink ? streamingThink : undefined} />
      )}
      <View style={chatItemStyle}>
        <Text style={styles.characterName}>{characterName}</Text>
        {chatContent}
      </View>
      {hasActions && (
        <View style={styles.actionsContainer}>
          {showRegenerate && onRegenerateFromMessage && (
            <TouchableOpacity style={styles.regenerateButton} onPress={() => onRegenerateFromMessage(chat.id)}>
              <Text style={styles.regenerateButtonText}>↻</Text>
            </TouchableOpacity>
          )}
          {canEdit && onEditMessage && (
            <TouchableOpacity style={styles.editButton} onPress={() => onEditMessage(chat.id)}>
              <Text style={styles.editButtonText}>✏️</Text>
            </TouchableOpacity>
          )}
          {showDiscard && onDiscardEdit && (
            <TouchableOpacity style={styles.editCancelButton} onPress={onDiscardEdit}>
              <Text style={styles.editCancelButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          {showSave && onSaveEditMessage && (
            <TouchableOpacity
              style={[styles.editSaveButton, !draft.trim() && styles.editSaveButtonDisabled]}
              onPress={() => draft.trim() && onSaveEditMessage(chat.id, draft)}
            >
              <Text style={styles.editSaveButtonText}>💾</Text>
            </TouchableOpacity>
          )}
          {showContinue && onContinueFromMessage && (
            <TouchableOpacity style={styles.continueButton} onPress={() => onContinueFromMessage(chat.id)}>
              <Text style={styles.continueButtonText}>▶</Text>
            </TouchableOpacity>
          )}
          {showDelete && onDeleteMessage && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteMessage(chat.id)}>
              <Text style={styles.deleteButtonText}>🗑</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export const ChatItem = memo(ChatItemBase);

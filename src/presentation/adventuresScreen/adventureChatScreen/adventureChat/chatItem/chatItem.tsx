import { memo, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RoleEnum } from '@domain/entities';
import { styles } from '../styles';
import { AdventureThink } from '../adventureThink';
import { TextMarkdown } from '../textMarkdown';
import { ChatItemProps } from './constants';

function ChatItemBase ({ message, isStreaming, characterNameById, onDeleteMessage, isMessageEditing, editingChatId, onEditMessage, onSaveEditMessage, onDiscardEdit, onContinueFromMessage, onRegenerateFromMessage, onRegenerateContent, onNavigateChatIndex, onNavigateThinkIndex, onRegenerateFromThink, onEditThink, onSaveThinkEdit, onDiscardThinkEdit, onDeleteThink, isThinkEditing, editingThinkChatId }: ChatItemProps) {
  const { content, think } = message;
  const isUserMessage = message.role === RoleEnum.USER;
  const characterName = characterNameById[message.characterId] ?? '';
  const isEditingThisMessage = !isStreaming && isMessageEditing && editingChatId === message.id;

  const [draft, setDraft] = useState(content);

  useEffect(() => {
    if (isEditingThisMessage) setDraft(content);
  }, [isEditingThisMessage, content]);

  const showOriginalActions = !isMessageEditing;

  const canEdit = showOriginalActions && !isStreaming && Boolean(onEditMessage);
  const showContinue = !isUserMessage && showOriginalActions && !isStreaming && Boolean(onContinueFromMessage);
  const showRegenerate = isUserMessage && showOriginalActions && Boolean(onRegenerateFromMessage);
  const showRegenerateContent = !isUserMessage && showOriginalActions && !isStreaming && Boolean(onRegenerateContent);
  const showDelete = isUserMessage && showOriginalActions && Boolean(onDeleteMessage);
  const showDiscard = isEditingThisMessage && Boolean(onDiscardEdit);
  const showSave = isEditingThisMessage && Boolean(onSaveEditMessage);
  const showNav = showOriginalActions && !isStreaming;
  const navEnabled = message.contentCount > 1;
  const navButtonTextClass = navEnabled ? styles.navButtonTextEnabled : styles.navButtonTextDisabled;
  const hasActions = showNav || canEdit || showContinue || showRegenerate || showRegenerateContent || showDelete || showDiscard || showSave;

  const handleNavBack = () => onNavigateChatIndex?.(message.id, -1);
  const handleNavAdvance = () => onNavigateChatIndex?.(message.id, 1);

  const hasThink = think !== undefined;

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
      {think && (
        <AdventureThink
          chatId={message.id}
          think={think}
          isStreaming={isStreaming}
          onNavigateThinkIndex={onNavigateThinkIndex}
          onRegenerateFromThink={onRegenerateFromThink}
          onEditThink={onEditThink}
          onSaveThinkEdit={onSaveThinkEdit}
          onDiscardThinkEdit={onDiscardThinkEdit}
          onDeleteThink={onDeleteThink}
          isThinkEditing={isThinkEditing}
          editingThinkChatId={editingThinkChatId}
        />
      )}
      <View style={chatItemStyle}>
        <Text style={styles.characterName}>{characterName}</Text>
        {chatContent}
      </View>
      {hasActions && (
        <View style={styles.actionsContainer}>
          {showNav && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNavBack}
              disabled={!navEnabled}
              accessibilityRole="button"
              accessibilityLabel="Versão anterior"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.navButtonText, navButtonTextClass]}>{'<'}</Text>
            </TouchableOpacity>
          )}
          {showRegenerate && onRegenerateFromMessage && (
            <TouchableOpacity style={styles.regenerateButton} onPress={() => onRegenerateFromMessage(message.id)}>
              <Text style={styles.regenerateButtonText}>↻</Text>
            </TouchableOpacity>
          )}
          {showRegenerateContent && onRegenerateContent && (
            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={() => onRegenerateContent(message.id)}
              accessibilityRole="button"
              accessibilityLabel="Regenerar conteúdo"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.regenerateButtonText}>⟳</Text>
            </TouchableOpacity>
          )}
          {canEdit && onEditMessage && (
            <TouchableOpacity style={styles.editButton} onPress={() => onEditMessage(message.id)}>
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
              onPress={() => draft.trim() && onSaveEditMessage(message.id, draft)}
            >
              <Text style={styles.editSaveButtonText}>💾</Text>
            </TouchableOpacity>
          )}
          {showContinue && onContinueFromMessage && (
            <TouchableOpacity style={styles.continueButton} onPress={() => onContinueFromMessage(message.id)}>
              <Text style={styles.continueButtonText}>▶</Text>
            </TouchableOpacity>
          )}
          {showDelete && onDeleteMessage && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteMessage(message.id)}>
              <Text style={styles.deleteButtonText}>🗑</Text>
            </TouchableOpacity>
          )}
          {showNav && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNavAdvance}
              disabled={!navEnabled}
              accessibilityRole="button"
              accessibilityLabel="Próxima versão"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[styles.navButtonText, navButtonTextClass]}>{'>'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export const ChatItem = memo(ChatItemBase);

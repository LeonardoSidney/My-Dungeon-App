import { memo, useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles as adventureStyles } from '../styles';
import { styles } from './styles';
import { TextMarkdown } from '../textMarkdown';
import { AdventureThinkProps } from './constants';

function AdventureThinkBase ({ chatId, think, isStreaming, thinkLength, thinkIndex, onNavigateThinkIndex, onRegenerateFromThink, onEditThink, onSaveThinkEdit, onDiscardThinkEdit, onDeleteThink, isThinkEditing, editingThinkChatId }: AdventureThinkProps) {
  const isEditingThisThink = !isStreaming && isThinkEditing && editingThinkChatId === chatId;

  const [draft, setDraft] = useState(think?.content ?? '');

  useEffect(() => {
    if (isEditingThisThink) setDraft(think?.content ?? '');
  }, [isEditingThisThink, think?.content]);

  if (!think) {
    return null;
  }

  const thinkBody = think.content;
  const showOriginalActions = !isEditingThisThink;
  const canEdit = showOriginalActions && !isStreaming && Boolean(thinkBody) && Boolean(onEditThink);
  const showRegenerate = showOriginalActions && !isStreaming && Boolean(onRegenerateFromThink);
  const showDelete = showOriginalActions && !isStreaming && thinkIndex > 0 && Boolean(onDeleteThink);
  const showDiscard = isEditingThisThink && Boolean(onDiscardThinkEdit);
  const showSave = isEditingThisThink && Boolean(onSaveThinkEdit);
  const showNav = showOriginalActions && !isStreaming;
  const navEnabled = thinkLength > 1;
  const navButtonTextClass = navEnabled ? adventureStyles.navButtonTextEnabled : adventureStyles.navButtonTextDisabled;
  const hasActions = showNav || canEdit || showRegenerate || showDelete || showDiscard || showSave;

  const handleNavBack = () => onNavigateThinkIndex?.(chatId, -1);
  const handleNavAdvance = () => onNavigateThinkIndex?.(chatId, 1);

  const streamingContent = (
    <Text style={styles.thinkText}>{thinkBody}</Text>
  );
  const markdownContent = thinkBody ? (
    <TextMarkdown content={thinkBody} style={styles.thinkText} />
  ) : null;
  const editingContent = (
    <TextInput
      style={styles.thinkEditInput}
      value={draft}
      onChangeText={setDraft}
      multiline
      textAlignVertical="top"
      selectionColor="transparent"
    />
  );
  const thinkContent = isEditingThisThink ? editingContent : (isStreaming ? streamingContent : markdownContent);

  return (
    <View style={styles.thinkContainer}>
      {thinkContent}
      {hasActions && (
        <View style={adventureStyles.actionsContainer}>
          {showNav && (
            <TouchableOpacity
              style={adventureStyles.navButton}
              onPress={handleNavBack}
              disabled={!navEnabled}
              accessibilityRole="button"
              accessibilityLabel="Versão anterior do raciocínio"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[adventureStyles.navButtonText, navButtonTextClass]}>{'<'}</Text>
            </TouchableOpacity>
          )}
          {showRegenerate && onRegenerateFromThink && (
            <TouchableOpacity style={adventureStyles.regenerateButton} onPress={() => onRegenerateFromThink(chatId)}>
              <Text style={adventureStyles.regenerateButtonText}>↻</Text>
            </TouchableOpacity>
          )}
          {canEdit && onEditThink && (
            <TouchableOpacity style={adventureStyles.editButton} onPress={() => onEditThink(chatId)}>
              <Text style={adventureStyles.editButtonText}>✏️</Text>
            </TouchableOpacity>
          )}
          {showDiscard && onDiscardThinkEdit && (
            <TouchableOpacity style={adventureStyles.editCancelButton} onPress={onDiscardThinkEdit}>
              <Text style={adventureStyles.editCancelButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          {showSave && onSaveThinkEdit && (
            <TouchableOpacity
              style={[adventureStyles.editSaveButton, !draft.trim() && adventureStyles.editSaveButtonDisabled]}
              onPress={() => draft.trim() && onSaveThinkEdit(chatId, draft)}
            >
              <Text style={adventureStyles.editSaveButtonText}>💾</Text>
            </TouchableOpacity>
          )}
          {showDelete && onDeleteThink && (
            <TouchableOpacity style={adventureStyles.deleteButton} onPress={() => onDeleteThink(chatId)}>
              <Text style={adventureStyles.deleteButtonText}>🗑</Text>
            </TouchableOpacity>
          )}
          {showNav && (
            <TouchableOpacity
              style={adventureStyles.navButton}
              onPress={handleNavAdvance}
              disabled={!navEnabled}
              accessibilityRole="button"
              accessibilityLabel="Próxima versão do raciocínio"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={[adventureStyles.navButtonText, navButtonTextClass]}>{'>'}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export const AdventureThink = memo(AdventureThinkBase);

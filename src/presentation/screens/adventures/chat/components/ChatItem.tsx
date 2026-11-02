import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessageView } from '@domain/controllers';
import { RoleEnum } from '@domain/entities';
import { colors } from '@presentation/theme';
import type { ChatMessageActions } from '../types';
import { MessageActionBar, type MessageAction } from './MessageActionBar';
import { TextMarkdown } from './textMarkdown';
import { ThinkBlock } from './ThinkBlock';
import { useEditDraft } from './useEditDraft';
import { EditDraftInput } from './editDraftInput';

type ChatItemProps = {
  message: ChatMessageView;
  characterName: string;
  editingChatId: string | null;
  editingThinkChatId: string | null;
  showThinkBlocks: boolean;
  actions: ChatMessageActions;
};

function ChatItemBase ({ message, characterName, editingChatId, editingThinkChatId, showThinkBlocks, actions }: ChatItemProps) {
  const { id, content, isStreaming } = message;
  const visibleThink = showThinkBlocks ? message.think : undefined;
  const isUserMessage = message.role === RoleEnum.USER;
  const isEditing = !isStreaming && editingChatId === id;
  const [draft, setDraft] = useEditDraft(content, isEditing);
  const canAct = editingChatId === null;

  const buttons: MessageAction[] = [];
  if (canAct && isUserMessage) {
    buttons.push({ key: 'regenerate', icon: '↻', tone: 'accent', onPress: () => actions.regenerateFrom(id) });
  }
  if (canAct && !isStreaming && !isUserMessage) {
    buttons.push({
      key: 'regenerateContent',
      icon: '⟳',
      tone: 'accent',
      onPress: () => actions.regenerateContent(id),
      accessibilityLabel: 'Regenerar conteúdo',
    });
  }
  if (canAct && !isStreaming) {
    buttons.push({ key: 'edit', icon: '✏️', tone: 'neutral', onPress: () => actions.startEdit(id) });
  }
  if (isEditing) {
    buttons.push(
      { key: 'discard', icon: '✕', tone: 'danger', onPress: actions.discardEdit },
      { key: 'save', icon: '💾', tone: 'neutral', disabled: !draft.trim(), onPress: () => actions.saveEdit(id, draft) },
    );
  }
  if (canAct && !isStreaming && !isUserMessage) {
    buttons.push({ key: 'continue', icon: '▶', tone: 'success', onPress: () => actions.continueFrom(id) });
  }
  if (canAct && isUserMessage) {
    buttons.push({ key: 'delete', icon: '🗑', tone: 'danger', onPress: () => actions.deleteMessage(message) });
  }

  const renderContent = () => {
    if (isStreaming) {
      return <Text style={styles.text}>{content}</Text>;
    }
    if (isEditing) {
      return <EditDraftInput value={draft} onChangeText={setDraft} />;
    }
    return <TextMarkdown content={content} />;
  };

  return (
    <View style={styles.wrapper}>
      {visibleThink && (
        <ThinkBlock
          chatId={id}
          think={visibleThink}
          isStreaming={isStreaming}
          editingThinkChatId={editingThinkChatId}
          actions={actions}
        />
      )}
      <View style={[styles.bubble, visibleThink && styles.bubbleBelowThink]}>
        <Text style={styles.characterName}>{characterName}</Text>
        {renderContent()}
      </View>
      <MessageActionBar
        versions={canAct && !isStreaming ? {
          canNavigate: message.contentCount > 1,
          onPrevious: () => actions.navigateContent(id, -1),
          onNext: () => actions.navigateContent(id, 1),
          previousLabel: 'Versão anterior',
          nextLabel: 'Próxima versão',
        } : undefined}
        actions={buttons}
      />
    </View>
  );
}

export const ChatItem = memo(ChatItemBase);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  bubble: {
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surfaceAlt,
  },
  bubbleBelowThink: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  characterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accentBlue,
    marginBottom: 4,
  },
  text: {
    color: colors.text,
  },
});

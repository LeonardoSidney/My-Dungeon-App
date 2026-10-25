import { memo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ChatThinkView } from '@domain/controllers';
import { colors } from '@presentation/theme';
import type { ChatMessageActions } from '../types';
import { MessageActionBar, type MessageAction } from './MessageActionBar';
import { TextMarkdown } from './textMarkdown';
import { useEditDraft } from './useEditDraft';
import { editInputStyle } from './chatMessage.styles';

type ThinkBlockProps = {
  chatId: string;
  think: ChatThinkView;
  isStreaming: boolean;
  editingThinkChatId: string | null;
  actions: ChatMessageActions;
};

function ThinkBlockBase ({ chatId, think, isStreaming, editingThinkChatId, actions }: ThinkBlockProps) {
  const content = think.content ?? '';
  const isEditing = !isStreaming && editingThinkChatId === chatId;
  const [draft, setDraft] = useEditDraft(content, isEditing);
  const canAct = !isEditing && !isStreaming;

  const buttons: MessageAction[] = [];
  if (canAct) {
    buttons.push({ key: 'regenerate', icon: '↻', tone: 'accent', onPress: () => actions.regenerateFromThink(chatId) });
  }
  if (canAct && content) {
    buttons.push({ key: 'edit', icon: '✏️', tone: 'neutral', onPress: () => actions.startThinkEdit(chatId) });
  }
  if (isEditing) {
    buttons.push(
      { key: 'discard', icon: '✕', tone: 'danger', onPress: actions.discardThinkEdit },
      { key: 'save', icon: '💾', tone: 'neutral', disabled: !draft.trim(), onPress: () => actions.saveThinkEdit(chatId, draft) },
    );
  }
  if (canAct && think.index > 0) {
    buttons.push({ key: 'delete', icon: '🗑', tone: 'danger', onPress: () => actions.deleteThink(chatId, think) });
  }

  const renderContent = () => {
    if (isEditing) {
      return (
        <TextInput
          style={[editInputStyle, styles.thinkText, styles.editInputText]}
          value={draft}
          onChangeText={setDraft}
          multiline
          textAlignVertical="top"
          selectionColor="transparent"
        />
      );
    }
    if (isStreaming) {
      return <Text style={styles.thinkText}>{content}</Text>;
    }
    return content ? <TextMarkdown content={content} style={styles.thinkText} /> : null;
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <MessageActionBar
        versions={canAct ? {
          canNavigate: think.count > 1,
          onPrevious: () => actions.navigateThink(chatId, -1),
          onNext: () => actions.navigateThink(chatId, 1),
          previousLabel: 'Versão anterior do raciocínio',
          nextLabel: 'Próxima versão do raciocínio',
        } : undefined}
        actions={buttons}
      />
    </View>
  );
}

export const ThinkBlock = memo(ThinkBlockBase);

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomWidth: 0,
  },
  thinkText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textSubtle,
  },
  editInputText: {
    color: colors.text,
  },
});

import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { AdventureChatCharacter, AdventureChatWorldMaster, ChatMessageView } from '@domain/controllers';
import { switchTrackColor } from '@presentation/components';
import { useKeyboardHeight } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { DetailHeader, detailHeaderStyles } from '../DetailHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { MessageInput } from './components/MessageInput';
import { isWaitingForPlayers } from './chatActions';
import { useChatAutoScroll } from './hooks/useChatAutoScroll';
import { useChatReplies } from './hooks/useChatReplies';
import { useComposer } from './hooks/useComposer';
import { useMessageActions } from './hooks/useMessageActions';
import { useThinkBlocksVisibility } from './hooks/useThinkBlocksVisibility';
import type { SetMessages, UpdateMessages } from './types';
import { styles } from './AdventureChatScreen.styles';

type AdventureChatProps = {
  adventureId: string;
  adventureName: string;
  characters: AdventureChatCharacter[];
  worldMaster: AdventureChatWorldMaster | null;
  messages: ChatMessageView[];
  setMessages: SetMessages;
  updateMessages: UpdateMessages;
  onBack: () => void;
  onOpenSettings: () => void;
};

export function AdventureChat ({
  adventureId,
  adventureName,
  characters,
  worldMaster,
  messages,
  setMessages,
  updateMessages,
  onBack,
  onOpenSettings,
}: AdventureChatProps) {
  const controllers = useControllers();
  const keyboardHeight = useKeyboardHeight();
  const [selectedCharacterId, setSelectedCharacterId] = useState(characters[0]?.id);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingThinkChatId, setEditingThinkChatId] = useState<string | null>(null);

  const selectedCharacter = characters.find(character => character.id === selectedCharacterId) ?? characters[0];

  const characterNameById = useMemo(() => {
    const names: Record<string, string> = {};
    characters.forEach(character => { names[character.id] = character.name; });
    if (worldMaster) {
      names[worldMaster.id] = worldMaster.name;
    }
    return names;
  }, [characters, worldMaster]);

  const clearEditing = useCallback(() => setEditingChatId(null), []);
  const handleCharacterSelect = useCallback((character: AdventureChatCharacter) => {
    setSelectedCharacterId(character.id);
  }, []);

  const replies = useChatReplies({
    adventureId,
    subscribeChatReply: controllers.subscribeChatReply,
    getChatMessage: controllers.getChatMessage,
    getChatMessages: controllers.getChatMessages,
    generateChatReply: controllers.generateChatReply,
    stopChatReply: controllers.stopChatReply,
    setMessages,
    updateMessages,
    alert: controllers.alert,
  });

  const composer = useComposer({
    adventureId,
    selectedCharacter,
    editingChatId,
    clearEditing,
    reloadMessages: replies.reloadMessages,
    streamReply: replies.streamReply,
    appendChatAdventure: controllers.appendChatAdventure,
    addChatVersion: controllers.addChatVersion,
    resendChat: controllers.resendChat,
    alert: controllers.alert,
  });

  const actions = useMessageActions({
    adventureId,
    reloadMessages: replies.reloadMessages,
    streamReply: replies.streamReply,
    setEditingChatId,
    setEditingThinkChatId,
    setComposerMessage: composer.setMessage,
    controllers,
  });

  const thinkBlocks = useThinkBlocksVisibility({
    getThinkBlocksVisibility: controllers.getThinkBlocksVisibility,
    saveThinkBlocksVisibility: controllers.saveThinkBlocksVisibility,
    alert: controllers.alert,
  });

  const autoScroll = useChatAutoScroll(messages);

  const isPlayersTurn = useMemo(() => isWaitingForPlayers(messages), [messages]);
  const canSkipTurn = isPlayersTurn && !replies.isReplying && !editingChatId && !composer.message.trim();

  return (
    <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
      <DetailHeader
        title={adventureName}
        onBack={onBack}
        right={(
          <View style={styles.headerActions}>
            <View style={styles.thinkToggle}>
              <Text style={styles.thinkToggleLabel}>think</Text>
              <Switch
                value={thinkBlocks.showThinkBlocks}
                onValueChange={thinkBlocks.changeThinkBlocksVisibility}
                trackColor={switchTrackColor}
                accessibilityLabel="Mostrar raciocínio"
              />
            </View>
            <TouchableOpacity onPress={onOpenSettings}>
              <Text style={detailHeaderStyles.actionText}>settings</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.messagesContainer}>
        <ScrollView
          ref={autoScroll.scrollViewRef}
          style={styles.messagesContainer}
          nestedScrollEnabled
          onScroll={autoScroll.handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <ChatMessageList
            messages={messages}
            characterNameById={characterNameById}
            editingChatId={editingChatId}
            editingThinkChatId={editingThinkChatId}
            showThinkBlocks={thinkBlocks.showThinkBlocks}
            actions={actions}
          />
        </ScrollView>
        {replies.isReplying && autoScroll.showScrollToBottom && (
          <TouchableOpacity style={styles.scrollToBottomButton} onPress={autoScroll.jumpToBottom}>
            <Text style={styles.scrollToBottomText}>↓</Text>
          </TouchableOpacity>
        )}
      </View>

      <MessageInput
        value={composer.message}
        onChangeText={composer.setMessage}
        onKeyPress={composer.handleKeyPress}
        isStreaming={replies.isReplying}
        onSend={composer.send}
        onStop={replies.stopReply}
        canSkipTurn={canSkipTurn}
        onSkipTurn={replies.skipTurn}
        onResend={composer.resend}
        characters={characters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={handleCharacterSelect}
      />
    </View>
  );
}

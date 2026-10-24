import { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChatMessageView } from '@domain/controllers';
import { styles } from './styles';
import { AdventureChat } from './adventureChat';
import { AdventureChatSettings } from './adventureChatSettings/adventureChatSettings';
import { MessageInput } from './messageInput';
import { useAdventureChatState } from './hooks/useAdventureChatState';
import { useAdventureCharacters, useAdventureSummary, useAdventureWorldMaster, useChatMessages } from './hooks/useAdventureChatQueries';
import { useSettingsActions } from './hooks/useSettingsActions';
import { useMessageActions } from './hooks/useMessageActions';
import { useNavVersionIndex } from './hooks/useNavVersionIndex';
import { useMessageEditing } from './hooks/useMessageEditing';
import { useThinkEditing } from './hooks/useThinkEditing';
import { useThinkActions } from './hooks/useThinkActions';
import { useReloadMessages } from './hooks/useReloadMessages';
import { useSelectionActions } from './hooks/useSelectionActions';
import { useKeyboardLift } from './hooks/useKeyboardLift';
import { useAdventureStreaming } from './useAdventureStreaming';
import { useAdventureChatScreenLogic } from './useAdventureChatScreenLogic';
import { AdventureChatContentProps, AdventureChatScreenProps } from './constants';
import { colors } from '../../theme';

function AdventureChatContent ({ adventureId, adventureName, characters, worldMaster, messages, setMessages, updateMessages, reloadWorldMaster, onBack, controllers }: AdventureChatContentProps) {
  const { appendChatAdventure, addChatVersion, deleteChatAdventure, deleteChatVersion, continueFromChat, regenerateFromChat, resendChat, generateChatReply, getChatMessages, getChatMessage, stopChatReply, subscribeChatReply, alert, addThinkVersion, deleteThinkVersion, selectChatVersion } = controllers;
  const keyboardHeight = useKeyboardLift();

  const characterNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const character of characters) {
      map[character.id] = character.name;
    }
    if (worldMaster) {
      map[worldMaster.id] = worldMaster.name;
    }
    return map;
  }, [characters, worldMaster]);

  const {
    message,
    selectedCharacter,
    showSettings,
    setMessage,
    setSelectedCharacter,
    setShowSettings
  } = useAdventureChatState({ characters });

  const reloadMessages = useReloadMessages(adventureId, getChatMessages, setMessages);

  const { editingChatIdRef, isEditing, onStartEdit, clearEditing } = useMessageEditing();

  const { editingThinkChatIdRef, isThinkEditing, onStartThinkEdit, clearThinkEditing } = useThinkEditing();

  const {
    isStreaming,
    handleResend,
    handleSendMessage,
    handleRegenerateFromMessage,
    handleRegenerateFromThink,
    handleRegenerateContent,
    handleContinueFromMessage,
    handleStopStreaming
  } = useAdventureStreaming({
    adventureId,
    selectedCharacter,
    message,
    setMessages,
    updateMessages,
    setMessage,
    editingChatIdRef,
    clearEditing,
    appendChatAdventure,
    addChatVersion,
    continueFromChat,
    regenerateFromChat,
    resendChat,
    generateChatReply,
    getChatMessages,
    getChatMessage,
    stopChatReply,
    subscribeChatReply,
    alert
  });

  const handleSaveEdit = useCallback(
    async (chatId: string, content: string) => {
      if (!editingChatIdRef.current || !content.trim()) return;

      const response = await addChatVersion.handle({ adventureId, chatId, content });

      if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to save message edit' });
        return;
      }

      clearEditing();
      setMessage('');
      await reloadMessages();
    },
    [editingChatIdRef, adventureId, reloadMessages, clearEditing, setMessage, addChatVersion, alert]
  );

  const handleSaveThinkEdit = useCallback(
    async (chatId: string, content: string) => {
      if (!editingThinkChatIdRef.current || !content.trim()) return;

      const response = await addThinkVersion.handle({ adventureId, chatId, content });

      if (!response.success) {
        alert.handle({ title: 'Erro', message: response.error ?? 'Failed to save think edit' });
        return;
      }

      clearThinkEditing();
      await reloadMessages();
    },
    [editingThinkChatIdRef, adventureId, reloadMessages, clearThinkEditing, addThinkVersion, alert]
  );

  const {
    onDeleteThink
  } = useThinkActions({
    adventureId,
    messages,
    reloadMessages,
    deleteThinkVersion,
    alert
  });

  const onNavigateThinkIndex = useNavVersionIndex({
    adventureId,
    kind: 'think',
    reloadMessages,
    selectChatVersion
  });

  const { scrollViewRef, showScrollToBottom, handleScroll, handleScrollToBottom } = useAdventureChatScreenLogic(messages);

  const {
    handleSettingsClick,
    handleBackFromSettings
  } = useSettingsActions({
    setShowSettings
  });

  const {
    onDeleteMessage,
    handleKeyPress
  } = useMessageActions({
    adventureId,
    messages,
    reloadMessages,
    deleteChatAdventure,
    deleteChatVersion,
    setMessage,
    message,
    handleSendMessage,
    alert
  });

  const onNavigateChatIndex = useNavVersionIndex({
    adventureId,
    kind: 'content',
    reloadMessages,
    selectChatVersion
  });

  const { handleCharacterSelect } = useSelectionActions({ setSelectedCharacter });

  const isStreamingActive = isStreaming;
  const sendButtonOnPress = isStreamingActive ? handleStopStreaming : handleSendMessage;

  const shouldShowScrollButton = isStreamingActive && showScrollToBottom;

  if (showSettings) {
    return (
      <AdventureChatSettings
        onBack={handleBackFromSettings}
        adventureId={adventureId}
        adventureName={adventureName}
        worldMaster={worldMaster ?? undefined}
        onWorldMasterChange={reloadWorldMaster}
        controllers={controllers}
      />
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{adventureName}</Text>
        <TouchableOpacity onPress={handleSettingsClick}>
          <Text style={styles.headerText}>settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messagesContainer}>
        <ScrollView
          style={styles.messagesContainer}
          nestedScrollEnabled
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <AdventureChat
            messages={messages}
            characterNameById={characterNameById}
            onDeleteMessage={onDeleteMessage}
            isMessageEditing={isEditing}
            editingChatId={editingChatIdRef.current}
            onEditMessage={onStartEdit}
            onSaveEditMessage={handleSaveEdit}
            onDiscardEdit={clearEditing}
            onContinueFromMessage={handleContinueFromMessage}
            onRegenerateFromMessage={handleRegenerateFromMessage}
            onRegenerateContent={handleRegenerateContent}
            onNavigateChatIndex={onNavigateChatIndex}
            onNavigateThinkIndex={onNavigateThinkIndex}
            onRegenerateFromThink={handleRegenerateFromThink}
            onEditThink={onStartThinkEdit}
            onSaveThinkEdit={handleSaveThinkEdit}
            onDiscardThinkEdit={clearThinkEditing}
            onDeleteThink={onDeleteThink}
            isThinkEditing={isThinkEditing}
            editingThinkChatId={editingThinkChatIdRef.current}
          />
        </ScrollView>
        {shouldShowScrollButton && (
          <TouchableOpacity style={styles.scrollToBottomButton} onPress={handleScrollToBottom}>
            <Text style={styles.scrollToBottomText}>↓</Text>
          </TouchableOpacity>
        )}
      </View>

      <MessageInput
        value={message}
        onChangeText={setMessage}
        onKeyPress={handleKeyPress}
        isStreaming={isStreamingActive}
        onSend={sendButtonOnPress}
        onResend={handleResend}
        characters={characters}
        selectedCharacterId={selectedCharacter.id}
        onCharacterSelect={handleCharacterSelect}
      />
    </View>
  );
}

export function AdventureChatScreen (params: AdventureChatScreenProps) {
  const { adventureId, onBack, controllers } = params;
  const summary = useAdventureSummary(adventureId, controllers.getAdventureSummary);
  const characters = useAdventureCharacters(adventureId, controllers.getAdventureCharacters);
  const worldMaster = useAdventureWorldMaster(adventureId, controllers.getAdventureWorldMaster);
  const chatMessages = useChatMessages(adventureId, controllers.getChatMessages);
  const error = summary.error ?? characters.error ?? worldMaster.error ?? chatMessages.error;
  const { setData: setChatMessages } = chatMessages;

  const setMessages = useCallback((messages: ChatMessageView[]) => {
    setChatMessages(messages);
  }, [setChatMessages]);

  const updateMessages = useCallback((update: (messages: ChatMessageView[]) => ChatMessageView[]) => {
    setChatMessages(current => (current ? update(current) : current));
  }, [setChatMessages]);

  const isLoaded = summary.isLoaded && characters.isLoaded && worldMaster.isLoaded && chatMessages.isLoaded;
  if (isLoaded && summary.data && characters.data && chatMessages.data) {
    return (
      <AdventureChatContent
        adventureId={adventureId}
        adventureName={summary.data.name}
        characters={characters.data}
        worldMaster={worldMaster.data}
        messages={chatMessages.data}
        setMessages={setMessages}
        updateMessages={updateMessages}
        reloadWorldMaster={worldMaster.reload}
        onBack={onBack}
        controllers={controllers}
      />
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.text} />
      <Text style={styles.loadingText}>Carregando aventura...</Text>
    </View>
  );
}

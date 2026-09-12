import { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AdventureChat } from './adventureChat';
import { AdventureChatSettings } from './adventureChatSettings/adventureChatSettings';
import { MessageInput } from './messageInput';
import { useAdventureChatState } from './hooks/useAdventureChatState';
import { useHydratedAdventure } from './hooks/useHydratedAdventure';
import { useSettingsActions } from './hooks/useSettingsActions';
import { useMessageActions } from './hooks/useMessageActions';
import { useMessageEditing } from './hooks/useMessageEditing';
import { useSelectionActions } from './hooks/useSelectionActions';
import { useKeyboardLift } from './hooks/useKeyboardLift';
import { useAdventureStreaming } from './useAdventureStreaming';
import { useAdventureChatScreenLogic } from './useAdventureChatScreenLogic';
import { buildEditedAdventure } from './handleEditMessage';
import { AdventureChatContentProps, AdventureChatScreenProps } from './constants';
import { colors } from '../../theme';

function AdventureChatContent ({ adventure, hydrated, hydratedRef, onBack, controllers }: AdventureChatContentProps) {
  const hydratedCharacters = hydrated.characters;
  const { createChatAdventure, appendChatAdventure, startStreamingChat, updateStreamingChat, finishStreamingChat, getAdventureText, getNativeStreamCompletion } = controllers;
  const keyboardHeight = useKeyboardLift();

  const characterNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const character of hydratedCharacters) {
      map[character.id] = character.name;
    }
    return map;
  }, [hydratedCharacters]);

  const {
    currentAdventure,
    message,
    selectedCharacter,
    showSettings,
    setCurrentAdventure,
    setMessage,
    setSelectedCharacter,
    setShowSettings
  } = useAdventureChatState({ adventure, hydratedCharacters });

  const { editingChatIdRef, isEditing, onStartEdit, clearEditing } = useMessageEditing();

  const {
    isStreaming,
    handleResend,
    handleSendMessage,
    handleRegenerateFromMessage,
    handleContinueFromMessage,
    handleStopStreaming
  } = useAdventureStreaming({
    currentAdventure,
    selectedCharacter,
    message,
    setCurrentAdventure,
    setMessage,
    hydratedRef,
    editingChatIdRef,
    clearEditing,
    createChatAdventure,
    appendChatAdventure,
    startStreamingChat,
    updateStreamingChat,
    finishStreamingChat,
    getAdventureText,
    getNativeStreamCompletion
  });

  const handleSaveEdit = useCallback(
    (chatId: string, content: string) => {
      if (!editingChatIdRef.current || !content.trim()) return;
      const updatedAdventure = buildEditedAdventure(currentAdventure, chatId, content);
      setCurrentAdventure(updatedAdventure);
      clearEditing();
      setMessage('');
    },
    [editingChatIdRef, currentAdventure, setCurrentAdventure, clearEditing, setMessage]
  );

  const { scrollViewRef, showScrollToBottom, handleScroll, handleScrollToBottom } = useAdventureChatScreenLogic(
    currentAdventure
  );

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
    currentAdventure,
    setCurrentAdventure,
    setMessage,
    message,
    handleSendMessage
  });

  const {
    handleWorldMasterSelect,
    handleCharacterSelect
  } = useSelectionActions({
    setCurrentAdventure,
    setSelectedCharacter
  });

  const isStreamingActive = isStreaming;
  const sendButtonOnPress = isStreamingActive ? handleStopStreaming : handleSendMessage;

  const shouldShowScrollButton = isStreamingActive && showScrollToBottom;

  if (showSettings) {
    return (
      <AdventureChatSettings
        onBack={handleBackFromSettings}
        adventure={currentAdventure}
        onWorldMasterSelect={handleWorldMasterSelect}
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
        <Text style={styles.headerTitle}>{currentAdventure.name}</Text>
        <TouchableOpacity onPress={handleSettingsClick}>
          <Text style={styles.headerText}>settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.messagesContainer}>
        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <AdventureChat
            chats={currentAdventure.chat}
            streamingChat={null}
            characterNameById={characterNameById}
            onDeleteMessage={onDeleteMessage}
            isMessageEditing={isEditing}
            editingChatId={editingChatIdRef.current}
            onEditMessage={onStartEdit}
            onSaveEditMessage={handleSaveEdit}
            onDiscardEdit={clearEditing}
            onContinueFromMessage={handleContinueFromMessage}
            onRegenerateFromMessage={handleRegenerateFromMessage}
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
        characters={hydratedCharacters}
        selectedCharacterId={selectedCharacter.id}
        onCharacterSelect={handleCharacterSelect}
      />
    </View>
  );
}

export function AdventureChatScreen (params: AdventureChatScreenProps) {
  const { adventure, onBack, controllers } = params;
  const { hydrateAdventure } = controllers;
  const { hydrated, hydratedRef, hydratedError } = useHydratedAdventure({ adventure, hydrateAdventure });

  if (hydrated) {
    return (
      <AdventureChatContent
        adventure={adventure}
        hydrated={hydrated}
        hydratedRef={hydratedRef}
        onBack={onBack}
        controllers={controllers}
      />
    );
  }

  if (hydratedError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{hydratedError}</Text>
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

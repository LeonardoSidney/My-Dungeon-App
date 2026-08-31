import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AdventureChat } from './AdventureChat';
import { AdventureChatSettings } from './AdventureChatSettings/AdventureChatSettings';
import { MessageInput } from './MessageInput';
import { useAdventureChatState } from './hooks/useAdventureChatState';
import { useHydratedAdventure } from './hooks/useHydratedAdventure';
import { useSettingsActions } from './hooks/useSettingsActions';
import { useMessageActions } from './hooks/useMessageActions';
import { useSelectionActions } from './hooks/useSelectionActions';
import { useKeyboardLift } from './hooks/useKeyboardLift';
import { useAdventureStreaming } from './useAdventureStreaming';
import { useAdventureChatScreenLogic } from './useAdventureChatScreenLogic';
import { AdventureChatContentProps, AdventureChatScreenProps } from './constants';

function AdventureChatContent ({ adventure, hydrated, hydratedRef, onBack }: AdventureChatContentProps) {
  const hydratedCharacters = hydrated.characters;
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

  const {
    isStreaming,
    handleResend,
    handleSendMessage,
    handleRegenerateFromMessage,
    handleStopStreaming
  } = useAdventureStreaming({
    currentAdventure,
    selectedCharacter,
    message,
    setCurrentAdventure,
    setMessage,
    hydratedRef
  });

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
  const { adventure, onBack } = params;
  const { hydrated, hydratedRef, hydratedError } = useHydratedAdventure({ adventure });

  if (hydrated) {
    return (
      <AdventureChatContent
        adventure={adventure}
        hydrated={hydrated}
        hydratedRef={hydratedRef}
        onBack={onBack}
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
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.loadingText}>Carregando aventura...</Text>
    </View>
  );
}

import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AdventureChat } from './AdventureChat';
import { AdventureChatSettings } from './AdventureChatSettings/AdventureChatSettings';
import { MessageInput } from './MessageInput';
import { useAdventureChatState } from './hooks/useAdventureChatState';
import { useSettingsActions } from './hooks/useSettingsActions';
import { useMessageActions } from './hooks/useMessageActions';
import { useSelectionActions } from './hooks/useSelectionActions';
import { useAdventureStreaming } from './useAdventureStreaming';
import { useAdventureChatScreenLogic } from './useAdventureChatScreenLogic';
import { AdventureChatScreenProps } from './constants';

export function AdventureChatScreen (params: AdventureChatScreenProps) {
  const { adventure, onBack } = params;

  const {
    currentAdventure,
    message,
    selectedCharacter,
    showSettings,
    setCurrentAdventure,
    setMessage,
    setSelectedCharacter,
    setShowSettings
  } = useAdventureChatState({ adventure });

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
    setMessage
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
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
        adventure={currentAdventure}
        selectedCharacterId={selectedCharacter.id}
        onCharacterSelect={handleCharacterSelect}
      />
    </KeyboardAvoidingView>
  );
}

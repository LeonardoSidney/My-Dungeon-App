import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AdventureChat } from './AdventureChat';
import { AdventureChatSettings } from './AdventureChatSettings/AdventureChatSettings';
import { CharacterSelector } from './CharacterSelector';
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
  const sendButtonLabel = isStreamingActive ? 'Stop' : 'Send';
  const sendButtonStyle = [styles.sendButtonContainer, isStreamingActive && styles.stopButtonContainer];

  const shouldShowScrollButton = isStreamingActive && showScrollToBottom;
  const shouldShowResendButton = !isStreamingActive;

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

      <View style={styles.inputContainer}>
        <CharacterSelector
          adventure={currentAdventure}
          onCharacterSelect={handleCharacterSelect}
          selectedCharacterId={selectedCharacter.id}
          style={styles.characterSelector}
        />
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
          selectionColor="transparent"
          cursorColor="transparent"
          placeholderTextColor="#888"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          onKeyPress={handleKeyPress}
        />
        {shouldShowResendButton && (
          <TouchableOpacity style={styles.resendButtonContainer} onPress={handleResend}>
            <Text style={styles.resendButtonText}>↻</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={sendButtonStyle}
          onPress={sendButtonOnPress}
        >
          <Text style={styles.sendButtonText}>{sendButtonLabel}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

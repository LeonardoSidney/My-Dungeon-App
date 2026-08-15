import React, { memo } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { CharacterSelector } from '../CharacterSelector';
import { MessageInputProps } from './constants';

function MessageInputBase (props: MessageInputProps) {
  const {
    value,
    onChangeText,
    onKeyPress,
    isStreaming,
    onSend,
    onResend,
    adventure,
    selectedCharacterId,
    onCharacterSelect
  } = props;

  const sendButtonLabel = isStreaming ? 'Stop' : 'Send';
  const sendButtonStyle = [styles.sendButtonContainer, isStreaming && styles.stopButtonContainer];
  const showResendButton = !isStreaming;

  return (
    <View style={styles.inputContainer}>
      <CharacterSelector
        adventure={adventure}
        onCharacterSelect={onCharacterSelect}
        selectedCharacterId={selectedCharacterId}
        style={styles.characterSelector}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Type a message..."
        multiline
        selectionColor="transparent"
        cursorColor="transparent"
        placeholderTextColor="#888"
        autoCorrect={false}
        underlineColorAndroid="transparent"
        onKeyPress={onKeyPress}
      />
      {showResendButton && (
        <TouchableOpacity style={styles.resendButtonContainer} onPress={onResend}>
          <Text style={styles.resendButtonText}>↻</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={sendButtonStyle}
        onPress={onSend}
      >
        <Text style={styles.sendButtonText}>{sendButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

export const MessageInput = memo(MessageInputBase);

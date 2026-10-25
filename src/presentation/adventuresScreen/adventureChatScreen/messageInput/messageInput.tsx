import React, { memo } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { CharacterSelector } from '../characterSelector';
import { MessageInputProps } from './constants';
import { colors } from '../../../theme';

function MessageInputBase (props: MessageInputProps) {
  const {
    value,
    onChangeText,
    onKeyPress,
    isStreaming,
    onSend,
    onResend,
    characters,
    selectedCharacterId,
    onCharacterSelect
  } = props;

  let sendButtonLabel = 'Send';
  if (isStreaming) {
    sendButtonLabel = 'Stop';
  }

  const sendButtonStyle = [styles.sendButtonContainer, isStreaming && styles.stopButtonContainer];
  const showResendButton = !isStreaming;

  return (
    <View style={styles.inputContainer}>
      <CharacterSelector
        characters={characters}
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
        cursorColor={colors.text}
        placeholderTextColor={colors.textSubtle}
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

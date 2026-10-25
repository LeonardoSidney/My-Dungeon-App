import { memo } from 'react';
import { Text, TextInput, TouchableOpacity, View, type TextInputKeyPressEvent } from 'react-native';
import { AdventureChatCharacter } from '@domain/controllers';
import { colors } from '@presentation/theme';
import { CharacterSelector } from './CharacterSelector';
import { styles } from './MessageInput.styles';

type MessageInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onKeyPress: (event: TextInputKeyPressEvent) => void;
  isStreaming: boolean;
  onSend: () => void;
  onStop: () => void;
  onResend: () => void;
  characters: AdventureChatCharacter[];
  selectedCharacter?: AdventureChatCharacter;
  onCharacterSelect: (character: AdventureChatCharacter) => void;
};

function MessageInputBase ({
  value,
  onChangeText,
  onKeyPress,
  isStreaming,
  onSend,
  onStop,
  onResend,
  characters,
  selectedCharacter,
  onCharacterSelect,
}: MessageInputProps) {
  return (
    <View style={styles.inputContainer}>
      {selectedCharacter && (
        <CharacterSelector
          characters={characters}
          selectedCharacter={selectedCharacter}
          onSelect={onCharacterSelect}
          style={styles.characterSelector}
        />
      )}
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
      {!isStreaming && (
        <TouchableOpacity style={styles.resendButtonContainer} onPress={onResend}>
          <Text style={styles.resendButtonText}>↻</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.sendButtonContainer, isStreaming && styles.stopButtonContainer]}
        onPress={isStreaming ? onStop : onSend}
      >
        <Text style={styles.sendButtonText}>{isStreaming ? 'Stop' : 'Send'}</Text>
      </TouchableOpacity>
    </View>
  );
}

export const MessageInput = memo(MessageInputBase);

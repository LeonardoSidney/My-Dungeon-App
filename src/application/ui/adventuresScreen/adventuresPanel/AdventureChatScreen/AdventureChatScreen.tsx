import { Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { styles } from './styles';
import { AdventureChatScreenProps } from './constants';
import { AdventureChatSettings } from './AdventureChatSettings/AdventureChatSettings';
import { CharacterSelector } from './CharacterSelector';
import { Character } from '@domain/entities';
import { useState, useMemo } from 'react';
import { Platform } from 'react-native';

export function AdventureChatScreen(params: AdventureChatScreenProps) {
  const { adventure, onBack } = params;
  const [showSettings, setShowSettings] = useState(false);
  const [currentAdventure, setCurrentAdventure] = useState(adventure);
  const [message, setMessage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(adventure.characters[0]);

  const webInputStyle = useMemo(() => {
    return Platform.OS === 'web' ? { WebkitAppearance: 'none', outline: 'none' } : {};
  }, []) as any;

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  const handleWorldMasterSelect = (updatedAdventure: typeof adventure) => {
    setCurrentAdventure(updatedAdventure);
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleSendMessage = () => {
    setMessage('');
  };

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
        <Text style={styles.headerTitle}>{adventure.name}</Text>
        <TouchableOpacity onPress={handleSettingsClick}>
          <Text style={styles.headerText}>settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.messagesContainer} />

      <View style={styles.inputContainer}>
        <CharacterSelector
          adventure={currentAdventure}
          onCharacterSelect={handleCharacterSelect}
          selectedCharacterId={selectedCharacter.id}
          style={styles.characterSelector}
        />
        <TextInput
          style={[styles.input, webInputStyle]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          onSubmitEditing={handleSendMessage}
          selectionColor="transparent"
          cursorColor="transparent"
          placeholderTextColor="#888"
          autoCorrect={false}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity style={styles.sendButtonContainer} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

import { Text, View, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { AdventureChatScreenProps } from './constants';
import { AdventureChatSettings } from './AdventureChatSettings/AdventureChatSettings';
import { useState } from 'react';

export function AdventureChatScreen(params: AdventureChatScreenProps) {
  const { adventure, onBack } = params;
  const [showSettings, setShowSettings] = useState(false);
  const [currentAdventure, setCurrentAdventure] = useState(adventure);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  const handleWorldMasterSelect = (updatedAdventure: typeof adventure) => {
    setCurrentAdventure(updatedAdventure);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.headerText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{adventure.name}</Text>
        <TouchableOpacity onPress={handleSettingsClick}>
          <Text style={styles.headerText}>settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

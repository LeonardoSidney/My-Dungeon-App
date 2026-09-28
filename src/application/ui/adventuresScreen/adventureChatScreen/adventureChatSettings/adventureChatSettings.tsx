import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './styles';
import { AdventureChatSettingsProps } from './constants';
import { WorldMasterDropdown } from './worldMasterDropdown';

export function AdventureChatSettings (params: AdventureChatSettingsProps) {
  const { onBack, adventure, onWorldMasterSelect, controllers } = params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.headerText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{adventure.name} Settings</Text>
      </View>
      <ScrollView nestedScrollEnabled style={styles.content}>
        <WorldMasterDropdown adventure={adventure} onWorldMasterSelect={onWorldMasterSelect} controllers={controllers} />
      </ScrollView>
    </View>
  );
}

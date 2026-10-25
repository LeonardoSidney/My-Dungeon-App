import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { styles } from './styles';
import { AdventureChatSettingsProps } from './constants';
import { WorldMasterDropdown } from './worldMasterDropdown';

export function AdventureChatSettings (params: AdventureChatSettingsProps) {
  const { onBack, adventureId, adventureName, worldMaster, onWorldMasterChange, controllers } = params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.headerText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{adventureName} Settings</Text>
      </View>
      <ScrollView nestedScrollEnabled style={styles.content}>
        <WorldMasterDropdown
          adventureId={adventureId}
          worldMaster={worldMaster}
          onWorldMasterChange={onWorldMasterChange}
          controllers={controllers}
        />
      </ScrollView>
    </View>
  );
}

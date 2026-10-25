import { Text, TouchableOpacity, View } from 'react-native';
import { AdventureChatWorldMaster } from '@domain/controllers';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { useWorldMasterPicker } from './useWorldMasterPicker';
import { styles } from './WorldMasterPicker.styles';

type WorldMasterPickerProps = {
  adventureId: string;
  worldMaster: AdventureChatWorldMaster | null;
  onChange: () => Promise<void>;
};

export function WorldMasterPicker ({ adventureId, worldMaster, onChange }: WorldMasterPickerProps) {
  const { getWorldMasters, setAdventureWorldMaster, alert } = useControllers();
  const picker = useWorldMasterPicker({
    adventureId,
    currentWorldMasterId: worldMaster?.id,
    onChange,
    getWorldMasters,
    setAdventureWorldMaster,
    alert,
  });

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.dropdownButton} onPress={picker.toggle}>
        <Text style={styles.dropdownButtonText}>World Master</Text>
      </TouchableOpacity>

      {picker.isOpen && (
        <View style={styles.dropdownList}>
          {worldMaster && (
            <View style={styles.currentItem}>
              <Text style={styles.itemText}>{worldMaster.name}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.addButton} onPress={picker.loadCandidates}>
            <Text style={styles.addButtonText}>+ Add World Master</Text>
          </TouchableOpacity>

          {picker.candidates?.map(candidate => (
            <TouchableOpacity key={candidate.id} style={styles.candidateButton} onPress={() => picker.select(candidate)}>
              <Text style={styles.itemText}>{candidate.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

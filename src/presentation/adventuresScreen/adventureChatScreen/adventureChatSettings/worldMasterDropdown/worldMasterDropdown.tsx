import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AdventureChatWorldMaster } from '@domain/controllers';
import { WorldMasterDropdownControllers } from '../constants';
import { useWorldMasterDropdown } from './hooks/useWorldMasterDropdown';

interface WorldMasterDropdownProps {
  adventureId: string;
  worldMaster?: AdventureChatWorldMaster;
  onWorldMasterChange: () => Promise<void>;
  controllers: WorldMasterDropdownControllers;
}

export function WorldMasterDropdown (params: WorldMasterDropdownProps) {
  const { adventureId, worldMaster: selectedWorldMaster, onWorldMasterChange, controllers } = params;
  const { getWorldMasters, setAdventureWorldMaster, alert } = controllers;

  const {
    showList,
    isAdding,
    allWorldMasters,
    toggleList,
    handleAddWorldMaster,
    handleWorldMasterSelect
  } = useWorldMasterDropdown({
    adventureId,
    worldMasterId: selectedWorldMaster?.id,
    onWorldMasterChange,
    getWorldMasters,
    setAdventureWorldMaster,
    alert
  });

  function renderWorldMasterListItem (item: AdventureChatWorldMaster) {
    return (
      <View key={item.id} style={styles.worldMasterItem}>
        <Text style={styles.worldMasterItemText}>{item.name}</Text>
      </View>
    );
  }

  function renderGetWorldMasterItem (item: AdventureChatWorldMaster) {
    return (
      <TouchableOpacity key={item.id} style={styles.getWorldMasterButton} onPress={() => handleWorldMasterSelect(item)}>
        <Text style={styles.getWorldMasterButtonText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.worldMasterSection}>
      <TouchableOpacity style={styles.dropdownButton} onPress={toggleList}>
        <Text style={styles.dropdownButtonText}>World Master</Text>
      </TouchableOpacity>

      {showList && (
        <View style={styles.dropdownList}>
          {selectedWorldMaster && (
            <View key={selectedWorldMaster.id}>{renderWorldMasterListItem(selectedWorldMaster)}</View>
          )}
          <TouchableOpacity style={styles.addWorldMasterButton} onPress={handleAddWorldMaster}>
            <Text style={styles.addWorldMasterButtonText}>+ Add World Master</Text>
          </TouchableOpacity>
          {isAdding &&
            allWorldMasters.map((worldMaster: AdventureChatWorldMaster) => (
              <View key={worldMaster.id}>{renderGetWorldMasterItem(worldMaster)}</View>
            ))}
        </View>
      )}
    </View>
  );
}

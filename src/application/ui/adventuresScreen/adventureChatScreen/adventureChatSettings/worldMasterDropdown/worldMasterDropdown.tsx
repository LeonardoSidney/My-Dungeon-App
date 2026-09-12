import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { Adventure, WorldMaster } from '@domain/entities';
import { WorldMasterDropdownControllers } from '../constants';
import { useWorldMasterDropdown } from './hooks/useWorldMasterDropdown';
import { useEntityList } from '@application/ui/hooks';

interface WorldMasterDropdownProps {
  adventure: Adventure;
  onWorldMasterSelect: (adventure: Adventure) => void;
  controllers: WorldMasterDropdownControllers;
}

export function WorldMasterDropdown (params: WorldMasterDropdownProps) {
  const { adventure, onWorldMasterSelect, controllers } = params;
  const { getWorldMasters, editAdventure } = controllers;

  const { items: worldMasters } = useEntityList({ fetch: () => getWorldMasters.handle() });

  const {
    showList,
    isAdding,
    allWorldMasters,
    toggleList,
    handleAddWorldMaster,
    handleWorldMasterSelect
  } = useWorldMasterDropdown({
    adventure,
    onWorldMasterSelect,
    getWorldMasters,
    editAdventure
  });

  function renderWorldMasterListItem (item: WorldMaster) {
    return (
      <View key={item.id} style={styles.worldMasterItem}>
        <Text style={styles.worldMasterItemText}>{item.name}</Text>
      </View>
    );
  }

  function renderGetWorldMasterItem (item: WorldMaster) {
    return (
      <TouchableOpacity key={item.id} style={styles.getWorldMasterButton} onPress={() => handleWorldMasterSelect(item)}>
        <Text style={styles.getWorldMasterButtonText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  const selectedWorldMaster = adventure.worldMasterId
    ? worldMasters.find(wm => wm.id === adventure.worldMasterId)
    : undefined;

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
            allWorldMasters.map((worldMaster: WorldMaster) => (
              <View key={worldMaster.id}>{renderGetWorldMasterItem(worldMaster)}</View>
            ))}
        </View>
      )}
    </View>
  );
}

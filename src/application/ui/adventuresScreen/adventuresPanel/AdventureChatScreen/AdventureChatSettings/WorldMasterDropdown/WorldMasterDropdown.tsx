import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { WorldMaster, Adventure } from '@domain/entities';
import { useWorldMasterSelection } from './useWorldMasterSelection';
import { editAdventureController, getWorldMasterController } from '@infra/container';
import { useState, useEffect } from 'react';

interface WorldMasterDropdownProps {
  adventure: Adventure;
  onWorldMasterSelect: (adventure: Adventure) => void;
}

export function WorldMasterDropdown(params: WorldMasterDropdownProps) {
  const { adventure, onWorldMasterSelect } = params;
  const { worldMasters, showList, toggleList } = useWorldMasterSelection();
  const [allWorldMasters, setAllWorldMasters] = useState<WorldMaster[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [prevShowList, setPrevShowList] = useState(false);

  useEffect(() => {
    if (prevShowList && !showList) {
      setIsAdding(false);
      setAllWorldMasters([]);
    }
    setPrevShowList(showList);
  }, [showList, prevShowList]);

  async function handleAddWorldMaster() {
    try {
      const controller = getWorldMasterController();
      const response = await controller.handle();
      if (Array.isArray(response)) {
        const currentWorldMasterId = adventure.worldMaster?.id;
        const filteredMasters = response.filter(wm => wm.id !== currentWorldMasterId);
        setAllWorldMasters(filteredMasters);
        setIsAdding(true);
      }
    } catch (error) {
      console.error('Error loading world masters:', error);
    }
  }

  async function handleWorldMasterSelect(worldMaster: WorldMaster) {
    const updatedAdventure = { ...adventure, worldMaster };

    if (updatedAdventure.id) {
      const controller = editAdventureController();
      const response = await controller.handle({
        id: updatedAdventure.id,
        name: updatedAdventure.name,
        systemPrompts: updatedAdventure.systemPrompts,
        characters: updatedAdventure.characters,
        worldMaster: updatedAdventure.worldMaster,
        worlds: updatedAdventure.worlds,
        locations: updatedAdventure.locations,
        items: updatedAdventure.items,
        chat: updatedAdventure.chat,
        createdAt: updatedAdventure.createdAt,
      });

      if (response.adventure) {
        onWorldMasterSelect(response.adventure);
      }
    }
    toggleList();
  }

  function renderWorldMasterListItem(item: WorldMaster) {
    return (
      <View key={item.id} style={styles.worldMasterItem}>
        <Text style={styles.worldMasterItemText}>{item.name}</Text>
      </View>
    );
  }

  function renderGetWorldMasterItem(item: WorldMaster) {
    return (
      <TouchableOpacity key={item.id} style={styles.getWorldMasterButton} onPress={() => handleWorldMasterSelect(item)}>
        <Text style={styles.getWorldMasterButtonText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  const selectedWorldMaster = worldMasters.find(wm => wm.id === adventure.worldMaster?.id);

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

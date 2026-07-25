import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { World } from '@domain/entities';
import { styles } from './styles';
import { WorldPanel } from './worldPanel';
import { WorldForm } from './worldForm';
import { useWorldScreenLogic } from './useWorldScreenLogic';
import { WorldFormData } from './constants';
import { setInitialWorldState } from './constants';
import { handleWorldFormChange } from './handleWorldFormChange';
import { onAddNewWorld } from './onAddNewWorld';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseWorld } from './onEraseWorld';
import { onSaveWorld } from './onSaveWorld';

export function WorldScreen () {
  const [worlds, setWorlds] = useState<World[]>([]);
  const [worldStateFormData, setWorldFormData] = useState<WorldFormData>(setInitialWorldState());
  const [showForm, setShowForm] = useState(false);

  useWorldScreenLogic(setWorlds);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Worlds</Text>
        </View>

        <WorldPanel
          worlds={worlds}
          onEdit={(world: World) => onEditForm(world, setShowForm, setWorldFormData)}
          onDelete={(world: World) => onEraseWorld(world, setWorlds)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewWorld(setShowForm, setWorldFormData)}
        >
          <Text style={styles.addButtonText}>Add World</Text>
        </TouchableOpacity>

        <WorldForm
          showForm={showForm}
          worldStateFormData={worldStateFormData}
          onChange={handleWorldFormChange(setWorldFormData)}
          onCancel={() => onCancelForm(setShowForm, setWorldFormData)}
          onSave={() => onSaveWorld(worldStateFormData, setWorldFormData, setShowForm, setWorlds)}
        />

      </ScrollView>
    </View>
  );
}

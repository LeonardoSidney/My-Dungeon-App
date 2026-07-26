import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Assistant, WorldMaster } from '@domain/entities';
import { styles } from './styles';
import { WorldMasterPanel } from './worldMasterPanel';
import { WorldMasterForm } from './worldMasterForm';
import { useWorldMasterScreenLogic } from './useWorldMasterScreenLogic';
import { useAssistantWorldMasterLogic } from './useAssistantWorldMasterLogic';
import { WorldMasterFormData } from './constants';
import { setInitialWorldMasterState } from './setInitialWorldMasterState';
import { handleWorldMasterFormChange } from './handleWorldMasterFormChange';
import { onAddNewWorldMaster } from './onAddNewWorldMaster';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseWorldMaster } from './onEraseWorldMaster';
import { onSaveWorldMaster } from './onSaveWorldMaster';

export function WorldMasterScreen () {
  const [worldMasters, setWorldMasters] = useState<WorldMaster[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [worldMasterStateFormData, setWorldMasterFormData] = useState<WorldMasterFormData>(setInitialWorldMasterState());
  const [showForm, setShowForm] = useState(false);

  useAssistantWorldMasterLogic(setAssistants);
  useWorldMasterScreenLogic(setWorldMasters);

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>World Masters</Text>
        </View>

        <WorldMasterPanel
          worldMasters={worldMasters}
          onEdit={(worldMaster: WorldMaster) => onEditForm(worldMaster, assistants, setShowForm, setWorldMasterFormData)}
          onDelete={(worldMaster: WorldMaster) => onEraseWorldMaster(worldMaster, setWorldMasters)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewWorldMaster(setShowForm, setWorldMasterFormData)}
        >
          <Text style={styles.addButtonText}>Add World Master</Text>
        </TouchableOpacity>

        <WorldMasterForm
          showForm={showForm}
          worldMasterStateFormData={worldMasterStateFormData}
          onChange={handleWorldMasterFormChange(setWorldMasterFormData)}
          onCancel={() => onCancelForm(setShowForm, setWorldMasterFormData)}
          onSave={() => onSaveWorldMaster(worldMasterStateFormData, setWorldMasterFormData, setShowForm, setWorldMasters, assistants)}
          assistants={assistants}
        />

      </ScrollView>
    </View>
  );
}

import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Assistant, WorldMaster } from '@domain/entities';
import { styles } from './styles';
import { WorldMasterPanel } from './worldMasterPanel';
import { WorldMasterForm } from './worldMasterForm';
import { useWorldMasterScreenLogic } from './useWorldMasterScreenLogic';
import { useAssistantWorldMasterLogic } from './useAssistantWorldMasterLogic';
import { WorldMasterFormData, FormErrors } from './constants';
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useAssistantWorldMasterLogic(setAssistants);
  useWorldMasterScreenLogic(setWorldMasters);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!worldMasterStateFormData.name.trim()) errors.name = 'Name is required';
    if (!worldMasterStateFormData.activationWord.trim()) errors.activationWord = 'Activation Word is required';
    if (!worldMasterStateFormData.assistant) errors.assistant = 'Assistant is required';
    if (!worldMasterStateFormData.prompt.trim()) errors.prompt = 'Prompt is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveWorldMaster(worldMasterStateFormData, setWorldMasterFormData, setShowForm, setWorldMasters, assistants);
  };

  const handleFormChange = (field: keyof WorldMasterFormData, value: WorldMasterFormData[keyof WorldMasterFormData]) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleWorldMasterFormChange(setWorldMasterFormData)(field, value);
  };

  const handleAddNewWorldMaster = () => {
    setFormErrors({});
    onAddNewWorldMaster(setShowForm, setWorldMasterFormData);
  };

  const handleEditWorldMaster = (worldMaster: WorldMaster) => {
    setFormErrors({});
    onEditForm(worldMaster, assistants, setShowForm, setWorldMasterFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>World Masters</Text>
        </View>

        <WorldMasterPanel
          worldMasters={worldMasters}
          onEdit={handleEditWorldMaster}
          onDelete={(worldMaster: WorldMaster) => onEraseWorldMaster(worldMaster, setWorldMasters)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewWorldMaster}
        >
          <Text style={styles.addButtonText}>Add World Master</Text>
        </TouchableOpacity>

        <WorldMasterForm
          showForm={showForm}
          worldMasterStateFormData={worldMasterStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setWorldMasterFormData)}
          onSave={handleFormSave}
          assistants={assistants}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}

import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Assistant, WorldMaster } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, SelectField, SingleSelect, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { WorldMasterFormData, FormErrors, setInitialWorldMasterState, worldMasterFormConfig } from './constants';
import { handleWorldMasterFormChange } from './handleWorldMasterFormChange';
import { loadWorldMasters } from './loadWorldMasters';
import { loadAssistants } from './loadAssistants';
import { onAddNewWorldMaster } from './onAddNewWorldMaster';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseWorldMaster } from './onEraseWorldMaster';
import { onSaveWorldMaster } from './onSaveWorldMaster';

export function WorldMasterScreen () {
  const { getWorldMasters, getAssistants, createWorldMaster, editWorldMaster, eraseWorldMaster } = useControllers();
  const [worldMasters, setWorldMasters] = useState<WorldMaster[]>([]);
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [worldMasterStateFormData, setWorldMasterFormData] = useState<WorldMasterFormData>(setInitialWorldMasterState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadEntityList = useCallback(() => loadWorldMasters(getWorldMasters, setWorldMasters), [getWorldMasters, setWorldMasters]);
  const loadAssistantList = useCallback(() => loadAssistants(getAssistants, setAssistants), [getAssistants, setAssistants]);

  useEntityScreenLoad(loadEntityList);
  useEntityScreenLoad(loadAssistantList);

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

    await onSaveWorldMaster(worldMasterStateFormData, createWorldMaster, editWorldMaster, getWorldMasters, setWorldMasterFormData, setShowForm, setWorldMasters);
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

        <CrudEntityList
          items={worldMasters}
          emptyText="No world masters found."
          getDetailText={(worldMaster) => worldMaster.activationWord}
          onEdit={handleEditWorldMaster}
          onDelete={(worldMaster) => onEraseWorldMaster(worldMaster, eraseWorldMaster, getWorldMasters, setWorldMasters)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewWorldMaster}
        >
          <Text style={styles.addButtonText}>Add World Master</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={worldMasterStateFormData}
          config={worldMasterFormConfig}
          singleSelect={
            <SelectField label="Assistant" error={formErrors.assistant}>
              <SingleSelect
                items={assistants}
                selectedId={worldMasterStateFormData.assistant?.id}
                hasError={!!formErrors.assistant}
                emptyMessage="No assistants available"
                onSelect={(assistant: Assistant) => handleFormChange('assistant', assistant)}
              />
            </SelectField>
          }
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setWorldMasterFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}

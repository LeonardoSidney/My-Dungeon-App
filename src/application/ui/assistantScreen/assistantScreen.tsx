import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Assistant, Model, Sampler } from '@domain/entities';
import { styles } from './styles';
import { AssistantPanel } from './assistantPanel';
import { AssistantForm } from './assistantForm';
import { useAssistantScreenLogic } from './useAssistantScreenLogic';
import { useModelsLoad } from './useModelsLoad';
import { useSamplersLoad } from './useSamplersLoad';
import { AssistantFormData, FormErrors, setInitialAssistantState } from './constants';
import { handleAssistantFormChange } from './handleAssistantFormChange';
import { onAddNewAssistant } from './onAddNewAssistant';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseAssistant } from './onEraseAssistant';
import { onSaveAssistant } from './onSaveAssistant';

export function AssistantScreen () {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantStateFormData, setAssistantFormData] = useState<AssistantFormData>(setInitialAssistantState);
  const [models, setModels] = useState<Model[]>([]);
  const [samplers, setSamplers] = useState<Sampler[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useAssistantScreenLogic(setAssistants);
  useModelsLoad(setModels);
  useSamplersLoad(setSamplers);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!assistantStateFormData.name.trim()) errors.name = 'Name is required';
    if (!assistantStateFormData.model) errors.model = 'Model is required';
    if (!assistantStateFormData.sampler) errors.sampler = 'Sampler is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      await onSaveAssistant(assistantStateFormData, setAssistantFormData, setShowForm, setAssistants);
    } catch (error) {
      setFormErrors({ name: (error as Error).message });
    }
  };

  const handleFormChange = (field: keyof AssistantFormData, value: any) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleAssistantFormChange(setAssistantFormData)(field, value);
  };

  const handleAddNewAssistant = () => {
    setFormErrors({});
    onAddNewAssistant(setShowForm, setAssistantFormData);
  };

  const handleEditAssistant = (assistant: Assistant) => {
    setFormErrors({});
    onEditForm(assistant, models, samplers, setShowForm, setAssistantFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Assistants</Text>
        </View>

        <AssistantPanel
          assistants={assistants}
          onEdit={handleEditAssistant}
          onDelete={(assistant: Assistant) => onEraseAssistant(assistant, setAssistants)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAssistant}
        >
          <Text style={styles.addButtonText}>Add Assistant</Text>
        </TouchableOpacity>

        <AssistantForm
          showForm={showForm}
          assistantStateFormData={assistantStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setAssistantFormData)}
          onSave={handleFormSave}
          models={models}
          samplers={samplers}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}

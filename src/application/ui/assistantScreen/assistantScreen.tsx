import React, { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Assistant, Connection, Model, Sampler } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, SelectField, SingleSelect, useEntityScreenLoad } from '@application/ui/components';
import { useControllers } from '@adapters/ui/ControllersProvider';
import { AssistantFormData, FormErrors, setInitialAssistantState, assistantFormConfig } from './constants';
import { handleAssistantFormChange } from './handleAssistantFormChange';
import { loadAssistants } from './loadAssistants';
import { loadModels } from './loadModels';
import { loadSamplers } from './loadSamplers';
import { loadConnections } from './loadConnections';
import { onAddNewAssistant } from './onAddNewAssistant';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseAssistant } from './onEraseAssistant';
import { onSaveAssistant } from './onSaveAssistant';

export function AssistantScreen () {
  const { getAssistants, getConnections, getModelsFromProvider, getSamplers, createAssistant, editAssistant, eraseAssistant } = useControllers();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [assistantStateFormData, setAssistantFormData] = useState<AssistantFormData>(setInitialAssistantState());
  const [models, setModels] = useState<Model[]>([]);
  const [samplers, setSamplers] = useState<Sampler[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const loadEntityList = useCallback(() => loadAssistants(getAssistants, setAssistants), [getAssistants, setAssistants]);
  const loadModelList = useCallback(() => loadModels(getConnections, getModelsFromProvider, setModels), [getConnections, getModelsFromProvider, setModels]);
  const loadSamplerList = useCallback(() => loadSamplers(getSamplers, setSamplers), [getSamplers, setSamplers]);
  const loadConnectionList = useCallback(async () => setConnections(await loadConnections(getConnections)), [getConnections]);

  useEntityScreenLoad(loadEntityList);
  useEntityScreenLoad(loadModelList);
  useEntityScreenLoad(loadSamplerList);
  useEntityScreenLoad(loadConnectionList);

  const getConnectionName = (connectionId: string) => connections.find((c) => c.id === connectionId)?.name ?? connectionId;

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

    await onSaveAssistant(assistantStateFormData, createAssistant, editAssistant, getAssistants, setAssistantFormData, setShowForm, setAssistants);
  };

  const handleFormChange = (field: keyof AssistantFormData, value: AssistantFormData[keyof AssistantFormData]) => {
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

        <CrudEntityList
          items={assistants}
          emptyText="No assistants found."
          onEdit={handleEditAssistant}
          onDelete={(assistant) => onEraseAssistant(assistant, eraseAssistant, getAssistants, setAssistants)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAssistant}
        >
          <Text style={styles.addButtonText}>Add Assistant</Text>
        </TouchableOpacity>

        <ActivationPromptForm
          showForm={showForm}
          formData={assistantStateFormData}
          config={assistantFormConfig}
          singleSelect={
            <>
              <SelectField label="Model" error={formErrors.model}>
                <SingleSelect
                  items={models}
                  selectedId={assistantStateFormData.model ? `${assistantStateFormData.model.id}-${assistantStateFormData.model.connectionId}` : undefined}
                  itemKey={(model: Model) => `${model.id}-${model.connectionId}`}
                  renderLabel={(model: Model) => `${model.name} (${getConnectionName(model.connectionId)})`}
                  hasError={!!formErrors.model}
                  emptyMessage="No models available"
                  onSelect={(model: Model) => handleFormChange('model', model)}
                />
              </SelectField>
              <SelectField label="Sampler" error={formErrors.sampler}>
                <SingleSelect
                  items={samplers}
                  selectedId={assistantStateFormData.sampler?.id}
                  hasError={!!formErrors.sampler}
                  emptyMessage="No samplers available"
                  onSelect={(sampler: Sampler) => handleFormChange('sampler', sampler)}
                />
              </SelectField>
            </>
          }
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setAssistantFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}

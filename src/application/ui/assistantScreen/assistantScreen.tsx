import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Assistant, Model, Sampler } from '@domain/entities';
import { styles } from './styles';
import { AssistantPanel } from './assistantPanel';
import { AssistantForm } from './assistantForm';
import { useAssistantScreenLogic } from './useAssistantScreenLogic';
import { useModelsLoad } from './useModelsLoad';
import { useSamplersLoad } from './useSamplersLoad';
import { AssistantFormData, setInitialAssistantState } from './constants';
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

  useAssistantScreenLogic(setAssistants);
  useModelsLoad(setModels);
  useSamplersLoad(setSamplers);

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Assistants</Text>
        </View>

        <AssistantPanel
          assistants={assistants}
          onEdit={(assistant: Assistant) => onEditForm(assistant, models, samplers, setShowForm, setAssistantFormData)}
          onDelete={(assistant: Assistant) => onEraseAssistant(assistant, setAssistants)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddNewAssistant(setShowForm, setAssistantFormData)}
        >
          <Text style={styles.addButtonText}>Add Assistant</Text>
        </TouchableOpacity>

        <AssistantForm
          showForm={showForm}
          assistantStateFormData={assistantStateFormData}
          onChange={handleAssistantFormChange(setAssistantFormData)}
          onCancel={() => onCancelForm(setShowForm, setAssistantFormData)}
          onSave={() => onSaveAssistant(assistantStateFormData, setAssistantFormData, setShowForm, setAssistants)}
          models={models}
          samplers={samplers}
        />

      </ScrollView>
    </View>
  );
}

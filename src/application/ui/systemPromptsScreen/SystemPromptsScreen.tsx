import React, { useState } from 'react';
import { Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { SystemPrompt } from '@domain/entities';
import { styles } from './styles';
import { SystemPromptPanel } from './systemPromptPanel';
import { SystemPromptForm } from './systemPromptForm';
import { useSystemPromptsScreenLogic } from './useSystemPromptsScreenLogic';
import { SystemPromptFormData, FormErrors } from './constants';
import { setInitialSystemPromptState } from './setInitialSystemPromptState';
import { handleSystemPromptFormChange } from './handleSystemPromptFormChange';
import { onAddNewSystemPrompt } from './onAddNewSystemPrompt';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onEraseSystemPrompt } from './onEraseSystemPrompt';
import { onSaveSystemPrompt } from './onSaveSystemPrompt';

export function SystemPromptsScreen () {
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [systemPromptStateFormData, setSystemPromptFormData] = useState<SystemPromptFormData>(setInitialSystemPromptState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useSystemPromptsScreenLogic(setSystemPrompts);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!systemPromptStateFormData.name.trim()) errors.name = 'Name is required';
    if (!systemPromptStateFormData.content.trim()) errors.content = 'Content is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    await onSaveSystemPrompt(systemPromptStateFormData, setSystemPromptFormData, setShowForm, setSystemPrompts);
  };

  const handleFormChange = (field: keyof SystemPromptFormData, value: string | Date) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleSystemPromptFormChange(setSystemPromptFormData)(field, value);
  };

  const handleAddNewSystemPrompt = () => {
    setFormErrors({});
    onAddNewSystemPrompt(setShowForm, setSystemPromptFormData);
  };

  const handleEditSystemPrompt = (systemPrompt: SystemPrompt) => {
    setFormErrors({});
    onEditForm(systemPrompt, setShowForm, setSystemPromptFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>System Prompts</Text>
        </View>

        <SystemPromptPanel
          systemPrompts={systemPrompts}
          onEdit={handleEditSystemPrompt}
          onDelete={(systemPrompt) => onEraseSystemPrompt(systemPrompt, setSystemPrompts)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewSystemPrompt}
        >
          <Text style={styles.addButtonText}>Add System Prompt</Text>
        </TouchableOpacity>

        <SystemPromptForm
          showForm={showForm}
          systemPromptStateFormData={systemPromptStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setSystemPromptFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
        />

      </ScrollView>
    </View>
  );
}

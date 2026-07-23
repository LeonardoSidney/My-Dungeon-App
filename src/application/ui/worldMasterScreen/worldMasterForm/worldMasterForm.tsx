import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Assistant, WorldMaster } from '@domain/entities';
import { styles } from './styles';
import { useWorldMasterForm } from './useWorldMasterForm';
import { useWorldMasterSave } from './useWorldMasterSave';

type WorldMasterFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (worldMaster: {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
    assistant: Assistant;
  }) => void;
  initialData?: WorldMaster | null;
  assistants: Assistant[];
  selectedAssistant: Assistant | null;
  onAssistantChange: (assistant: Assistant | null) => void;
};

export function WorldMasterForm ({
  visible,
  onClose,
  onSave,
  initialData,
  assistants,
  selectedAssistant,
  onAssistantChange
}: WorldMasterFormProps) {
  const { formState, updateField, setLoading } = useWorldMasterForm(initialData);
  const { handleSave } = useWorldMasterSave({ onSave, onClose, setLoading });

  const isEditing = initialData !== null;

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit World Master' : 'New World Master'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, !formState.name.trim() && styles.inputError]}
            value={formState.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="e.g., Dungeon Master"
            placeholderTextColor="#666"
          />
          {!formState.name.trim() && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activation Word</Text>
          <TextInput
            style={[styles.input, !formState.activationWord.trim() && styles.inputError]}
            value={formState.activationWord}
            onChangeText={(value) => updateField('activationWord', value)}
            placeholder="e.g., Dungeon"
            placeholderTextColor="#666"
          />
          {!formState.activationWord.trim() && (
            <Text style={styles.errorText}>Activation word is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assistant</Text>
          <View style={styles.assistantDropdown}>
            {assistants.map((assistant) => (
              <TouchableOpacity
                key={assistant.id}
                style={[
                  styles.assistantOption,
                  selectedAssistant?.id === assistant.id && styles.assistantOptionSelected
                ]}
                onPress={() => onAssistantChange(assistant)}
              >
                <Text style={styles.assistantOptionText}>{assistant.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {!selectedAssistant && (
            <Text style={styles.errorText}>Assistant is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={[styles.input, !formState.prompt.trim() && styles.inputError, styles.promptInput]}
            value={formState.prompt}
            onChangeText={(value) => updateField('prompt', value)}
            placeholder="Enter the world master prompt..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
          {!formState.prompt.trim() && (
            <Text style={styles.errorText}>Prompt is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={[styles.input, styles.observationInput]}
            value={formState.observation}
            onChangeText={(value) => updateField('observation', value)}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.cancelButton}
            disabled={false}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSave(formState.name, formState.activationWord, formState.prompt, formState.observation, selectedAssistant)}
            style={[styles.saveButton, styles.saveButtonDisabled]}
            disabled={true}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

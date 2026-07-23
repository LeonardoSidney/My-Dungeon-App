import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Assistant, Model, Sampler } from '@domain/entities';
import { styles } from './styles';
import { useAssistantForm } from './useAssistantForm';
import { useAssistantSave } from './useAssistantSave';

type AssistantFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (assistant: {
    name: string;
    observation?: string;
    model: Model;
    sampler: Sampler;
  }) => void;
  initialData?: Assistant | null;
  models: Model[];
  samplers: Sampler[];
  selectedModel: Model | null;
  selectedSampler: Sampler | null;
  onModelChange: (model: Model | null) => void;
  onSamplerChange: (sampler: Sampler | null) => void;
};

export function AssistantForm ({
  visible,
  onClose,
  onSave,
  initialData,
  models,
  samplers,
  selectedModel,
  selectedSampler,
  onModelChange,
  onSamplerChange
}: AssistantFormProps) {
  const { formState, updateField, setLoading } = useAssistantForm(initialData);
  const { handleSave } = useAssistantSave({ onSave, onClose, setLoading });

  const isEditing = initialData !== null;

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit Assistant' : 'New Assistant'}
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
            placeholder="e.g., Dungeon Master Assistant"
            placeholderTextColor="#666"
          />
          {!formState.name.trim() && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model</Text>
          <View style={styles.dropdown}>
            {models.map((model, index) => (
              <TouchableOpacity
                key={`${model.id}-${model.connection.id}-${index}`}
                style={[
                  styles.dropdownOption,
                  selectedModel?.id === model.id &&
                  selectedModel?.connection.id === model.connection.id &&
                  styles.dropdownOptionSelected
                ]}
                onPress={() => onModelChange(model)}
              >
                <Text style={styles.dropdownOptionText}>{model.name} ({model.connection.name})</Text>
              </TouchableOpacity>
            ))}
            {models.length === 0 && (
              <Text style={styles.emptyDropdownText}>No models available</Text>
            )}
          </View>
          {!selectedModel && (
            <Text style={styles.errorText}>Model is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sampler</Text>
          <View style={styles.dropdown}>
            {samplers.map((sampler) => (
              <TouchableOpacity
                key={sampler.id}
                style={[
                  styles.dropdownOption,
                  selectedSampler?.id === sampler.id && styles.dropdownOptionSelected
                ]}
                onPress={() => onSamplerChange(sampler)}
              >
                <Text style={styles.dropdownOptionText}>{sampler.name}</Text>
              </TouchableOpacity>
            ))}
            {samplers.length === 0 && (
              <Text style={styles.emptyDropdownText}>No samplers available</Text>
            )}
          </View>
          {!selectedSampler && (
            <Text style={styles.errorText}>Sampler is required</Text>
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
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSave(formState.name, formState.observation, selectedModel, selectedSampler)}
            style={[
              styles.saveButton,
              !formState.name.trim() || !selectedModel || !selectedSampler ? styles.saveButtonDisabled : null
            ]}
            disabled={!formState.name.trim() || !selectedModel || !selectedSampler}
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


import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import '@domain/entities';
import { styles } from './styles';
import { AssistantFormProps } from './constants';

export function AssistantForm ({
  showForm,
  assistantStateFormData,
  onChange,
  onCancel,
  onSave,
  models,
  samplers
}: AssistantFormProps) {
  const { name, observation, model, sampler } = assistantStateFormData;
  const isEditing = !!assistantStateFormData.id;

  if (!showForm) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit Assistant' : 'New Assistant'}
          </Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Dungeon Master Assistant"
            placeholderTextColor="#666"
            value={name}
            onChangeText={(value) => onChange('name', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model</Text>
          <View style={styles.dropdown}>
            {models.map((modelItem) => (
              <TouchableOpacity
                key={`${modelItem.id}-${modelItem.connection.id}`}
                style={[
                  styles.dropdownOption,
                  model?.id === modelItem.id &&
                  model?.connection.id === modelItem.connection.id &&
                  styles.dropdownOptionSelected
                ]}
                onPress={() => onChange('model', modelItem)}
              >
                <Text style={styles.dropdownOptionText}>
                  {modelItem.name} ({modelItem.connection.name})
                </Text>
              </TouchableOpacity>
            ))}
            {models.length === 0 && (
              <Text style={styles.emptyDropdownText}>No models available</Text>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sampler</Text>
          <View style={styles.dropdown}>
            {samplers.map((samplerItem) => (
              <TouchableOpacity
                key={samplerItem.id}
                style={[
                  styles.dropdownOption,
                  sampler?.id === samplerItem.id && styles.dropdownOptionSelected
                ]}
                onPress={() => onChange('sampler', samplerItem)}
              >
                <Text style={styles.dropdownOptionText}>{samplerItem.name}</Text>
              </TouchableOpacity>
            ))}
            {samplers.length === 0 && (
              <Text style={styles.emptyDropdownText}>No samplers available</Text>
            )}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={[styles.input, styles.observationInput]}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            value={observation}
            onChangeText={(value) => onChange('observation', value)}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Save' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

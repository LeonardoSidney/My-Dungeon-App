import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Assistant type used via WorldMasterFormProps
import { WorldMasterFormProps } from '../constants';
import { styles } from './styles';

export function WorldMasterForm ({
  showForm,
  worldMasterStateFormData,
  onChange,
  onCancel,
  onSave,
  assistants,
  formErrors
}: WorldMasterFormProps) {
  const { name, activationWord, prompt, observation, assistant } = worldMasterStateFormData;
  const isEditing = !!worldMasterStateFormData.id;

  if (!showForm) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit World Master' : 'New World Master'}
          </Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, formErrors.name && styles.inputError]}
            placeholder="e.g., Dungeon Master"
            placeholderTextColor="#666"
            value={name}
            onChangeText={(value) => onChange('name', value)}
          />
          {formErrors.name && (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activation Word</Text>
          <TextInput
            style={[styles.input, formErrors.activationWord && styles.inputError]}
            placeholder="e.g., Dungeon"
            placeholderTextColor="#666"
            value={activationWord}
            onChangeText={(value) => onChange('activationWord', value)}
          />
          {formErrors.activationWord && (
            <Text style={styles.errorText}>{formErrors.activationWord}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assistant</Text>
          <View style={[styles.dropdown, formErrors.assistant && styles.inputError]}>
            {assistants.map((assistantItem) => (
              <TouchableOpacity
                key={assistantItem.id}
                style={[
                  styles.dropdownOption,
                  assistant?.id === assistantItem.id && styles.dropdownOptionSelected
                ]}
                onPress={() => onChange('assistant', assistantItem)}
              >
                <Text style={styles.dropdownOptionText}>{assistantItem.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {formErrors.assistant && (
            <Text style={styles.errorText}>{formErrors.assistant}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={[styles.input, styles.promptInput, formErrors.prompt && styles.inputError]}
            placeholder="Enter the world master prompt..."
            placeholderTextColor="#666"
            value={prompt}
            onChangeText={(value) => onChange('prompt', value)}
            multiline
            numberOfLines={4}
          />
          {formErrors.prompt && (
            <Text style={styles.errorText}>{formErrors.prompt}</Text>
          )}
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
          <TouchableOpacity
            onPress={onCancel}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSave}
            style={styles.saveButton}
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

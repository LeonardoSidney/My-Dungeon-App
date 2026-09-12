import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { colors } from '../../theme';
import type { ActivationPromptFormProps } from './constants';

export function ActivationPromptForm (params: ActivationPromptFormProps) {
  const { showForm, formData, config, singleSelect, multiSelect, extraFields, onChange, onCancel, onSave, formErrors } = params;

  if (!showForm) {
    return <></>;
  }

  const title = formData.id ? `Edit ${config.entityName}` : `Add ${config.entityName}`;
  const saveText = formData.id ? 'Save' : 'Create';

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>{title}</Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, formErrors.name && styles.inputError]}
            placeholder={config.namePlaceholder}
            placeholderTextColor={colors.placeholder}
            value={formData.name}
            onChangeText={(value) => onChange('name', value)}
          />
          {formErrors.name && (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          )}
        </View>

        {config.activationLabel && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{config.activationLabel}</Text>
            <TextInput
              style={[styles.input, formErrors.activationWord && styles.inputError]}
              placeholder={config.activationPlaceholder}
              placeholderTextColor={colors.placeholder}
              value={formData.activationWord}
              onChangeText={(value) => onChange('activationWord', value)}
            />
            {formErrors.activationWord && (
              <Text style={styles.errorText}>{formErrors.activationWord}</Text>
            )}
          </View>
        )}

        {config.promptPlaceholder && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prompt</Text>
            <TextInput
              style={[styles.promptInput, formErrors.prompt && styles.inputError]}
              placeholder={config.promptPlaceholder}
              placeholderTextColor={colors.placeholder}
              value={formData.prompt}
              onChangeText={(value) => onChange('prompt', value)}
              multiline
            />
            {formErrors.prompt && (
              <Text style={styles.errorText}>{formErrors.prompt}</Text>
            )}
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={styles.observationInput}
            placeholder="Additional observations..."
            placeholderTextColor={colors.placeholder}
            value={formData.observation}
            onChangeText={(value) => onChange('observation', value)}
            multiline
          />
        </View>

        {singleSelect}

        {multiSelect}

        {extraFields}

        <View style={styles.formActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>{saveText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

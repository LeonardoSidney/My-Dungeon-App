import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Connection } from '@domain/entities';
import { styles } from './styles';
import { useConnectionForm } from './useConnectionForm';
import { useFormValidation } from './useFormValidation';
import { useConnectionSave } from './useConnectionSave';

type ConnectionFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: Connection | null;
};

export function ConnectionForm ({
  visible,
  onClose,
  onSave,
  initialData
}: ConnectionFormProps) {
  const resolvedInitialData: Connection | null = initialData || null;

  const { formState, loading, updateField, setLoading, getPortNumber } = useConnectionForm(resolvedInitialData);
  const { errors, validate } = useFormValidation();
  const { saveConnection } = useConnectionSave();

  const handleSave = () => {
    const isValid = validate(formState);
    if (!isValid) return;

    saveConnection(
      formState,
      getPortNumber,
      resolvedInitialData,
      onClose,
      onSave,
      setLoading,
    );
  };

  const isEditing = resolvedInitialData !== null;

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit Connection' : 'New Connection'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formState.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="e.g., My Server"
            placeholderTextColor="#666"
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>IP Address</Text>
          <TextInput
            style={styles.input}
            value={formState.ip}
            onChangeText={(value) => updateField('ip', value)}
            placeholder="e.g., 192.168.1.100"
            placeholderTextColor="#666"
            keyboardType="url"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Port</Text>
          <TextInput
            style={[styles.input, errors.port && styles.inputError]}
            value={formState.port}
            onChangeText={(value) => updateField('port', value)}
            placeholder="e.g., 8080"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
          {errors.port && (
            <Text style={styles.errorText}>{errors.port}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Auth Token (optional)</Text>
          <TextInput
            style={styles.input}
            value={formState.auth}
            onChangeText={(value) => updateField('auth', value)}
            placeholder="Enter auth token"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onClose}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

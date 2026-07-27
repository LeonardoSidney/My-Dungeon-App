import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from './styles';
import { ConnectionFormData } from '../constants';

type ConnectionFormProps = {
  visible: boolean;
  formData: ConnectionFormData;
  onChange: (field: keyof ConnectionFormData, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  errors: { name?: string; ip?: string; port?: string; };
  loading: boolean;
};

export function ConnectionForm ({
  visible,
  formData,
  onChange,
  onCancel,
  onSave,
  errors,
  loading
}: ConnectionFormProps) {
  const isEditing = !!formData.id;

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
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={(value) => onChange('name', value)}
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
            style={[styles.input, errors.ip && styles.inputError]}
            value={formData.ip}
            onChangeText={(value) => onChange('ip', value)}
            placeholder="e.g., 192.168.1.100"
            placeholderTextColor="#666"
            keyboardType="url"
          />
          {errors.ip && (
            <Text style={styles.errorText}>{errors.ip}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Port</Text>
          <TextInput
            style={[styles.input, errors.port && styles.inputError]}
            value={formData.port}
            onChangeText={(value) => onChange('port', value)}
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
            value={formData.auth}
            onChangeText={(value) => onChange('auth', value)}
            placeholder="Enter auth token"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={onSave}
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

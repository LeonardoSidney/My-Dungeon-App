import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { SystemPromptFormProps } from './constants';

export function SystemPromptForm (params: SystemPromptFormProps) {
  const { showForm, systemPromptStateFormData, onChange, onCancel, onSave, formErrors } = params;

  if (!showForm) {
    return <></>;
  }

  const title = systemPromptStateFormData.id ? 'Edit System Prompt' : 'Add System Prompt';
  const saveText = systemPromptStateFormData.id ? 'Save' : 'Create';

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
            placeholder="e.g., Default System Prompt"
            placeholderTextColor="#666"
            value={systemPromptStateFormData.name}
            onChangeText={(value) => onChange('name', value)}
          />
          {formErrors.name && (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={[styles.contentInput, formErrors.content && styles.inputError]}
            placeholder="Enter the system prompt content..."
            placeholderTextColor="#666"
            value={systemPromptStateFormData.content}
            onChangeText={(value) => onChange('content', value)}
            multiline
          />
          {formErrors.content && (
            <Text style={styles.errorText}>{formErrors.content}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={styles.observationInput}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            value={systemPromptStateFormData.observation}
            onChangeText={(value) => onChange('observation', value)}
            multiline
          />
        </View>

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

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { WorldFormProps } from './constants';

export function WorldForm (params: WorldFormProps) {
  const { showForm, worldStateFormData, onChange, onCancel, onSave, formErrors } = params;

  if (!showForm) {
    return <></>;
  }

  const title = worldStateFormData.id ? 'Edit World' : 'Add World';
  const saveText = worldStateFormData.id ? 'Save' : 'Create';

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
            placeholder="e.g., Fantasy World"
            placeholderTextColor="#666"
            value={worldStateFormData.name}
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
            value={worldStateFormData.activationWord}
            onChangeText={(value) => onChange('activationWord', value)}
          />
          {formErrors.activationWord && (
            <Text style={styles.errorText}>{formErrors.activationWord}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={[styles.promptInput, formErrors.prompt && styles.inputError]}
            placeholder="Enter the world prompt..."
            placeholderTextColor="#666"
            value={worldStateFormData.prompt}
            onChangeText={(value) => onChange('prompt', value)}
            multiline
          />
          {formErrors.prompt && (
            <Text style={styles.errorText}>{formErrors.prompt}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={styles.observationInput}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            value={worldStateFormData.observation}
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

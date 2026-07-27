import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { StatusFormProps } from './constants';

export function StatusForm (params: StatusFormProps) {
  const { showForm, statusStateFormData, onChange, onCancel, onSave, formErrors } = params;

  if (!showForm) {
    return <></>;
  }

  const title = statusStateFormData.id ? 'Edit Status' : 'Add Status';
  const saveText = statusStateFormData.id ? 'Save' : 'Create';

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
            placeholder="e.g., Blessing"
            placeholderTextColor="#666"
            value={statusStateFormData.name}
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
            placeholder="e.g., blessing;holy"
            placeholderTextColor="#666"
            value={statusStateFormData.activationWord}
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
            placeholder="Enter the status prompt..."
            placeholderTextColor="#666"
            value={statusStateFormData.prompt}
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
            value={statusStateFormData.observation}
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

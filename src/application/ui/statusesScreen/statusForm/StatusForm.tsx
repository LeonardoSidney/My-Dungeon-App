import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { StatusFormProps } from './constants';

export function StatusForm (params: StatusFormProps) {
  const { showForm, statusStateFormData, onChange, onCancel, onSave } = params;

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
            style={styles.input}
            placeholder="e.g., Blessing"
            placeholderTextColor="#666"
            value={statusStateFormData.name}
            onChangeText={(value) => onChange('name', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activation Word</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., blessing;holy"
            placeholderTextColor="#666"
            value={statusStateFormData.activationWord}
            onChangeText={(value) => onChange('activationWord', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={styles.promptInput}
            placeholder="Enter the status prompt..."
            placeholderTextColor="#666"
            value={statusStateFormData.prompt}
            onChangeText={(value) => onChange('prompt', value)}
            multiline
          />
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

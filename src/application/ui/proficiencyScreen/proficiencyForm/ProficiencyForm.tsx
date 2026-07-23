import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { ProficiencyFormProps } from './constants';

export function ProficiencyForm (params: ProficiencyFormProps) {
  const { showForm, proficiencyStateFormData, onChange, onCancel, onSave } = params;

  if (!showForm) {
    return <></>;
  }

  const title = proficiencyStateFormData.id ? 'Edit Proficiency' : 'Add Proficiency';
  const saveText = proficiencyStateFormData.id ? 'Save' : 'Create';

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
            placeholder="e.g., Combat Mastery"
            placeholderTextColor="#666"
            value={proficiencyStateFormData.name}
            onChangeText={(value) => onChange('name', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activation Word</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Combat"
            placeholderTextColor="#666"
            value={proficiencyStateFormData.activationWord}
            onChangeText={(value) => onChange('activationWord', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={styles.promptInput}
            placeholder="Enter the proficiency prompt..."
            placeholderTextColor="#666"
            value={proficiencyStateFormData.prompt}
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
            value={proficiencyStateFormData.observation}
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

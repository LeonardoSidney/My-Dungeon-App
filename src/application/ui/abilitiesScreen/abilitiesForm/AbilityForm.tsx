import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AbilityFormProps } from './constants';

export function AbilityForm (params: AbilityFormProps) {
  const { showForm, abilityStateFormData, onChange, onCancel, onSave, formErrors } = params;

  if (!showForm) {
    return <></>;
  }

  const title = abilityStateFormData.id ? 'Edit Ability' : 'Add Ability';
  const saveText = abilityStateFormData.id ? 'Save' : 'Create';

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
            placeholder="e.g., Fireball"
            placeholderTextColor="#666"
            value={abilityStateFormData.name}
            onChangeText={(value) => onChange('name', value)}
          />
          {formErrors.name && (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activation World</Text>
          <TextInput
            style={[styles.input, formErrors.activationWorld && styles.inputError]}
            placeholder="e.g., Combat"
            placeholderTextColor="#666"
            value={abilityStateFormData.activationWorld}
            onChangeText={(value) => onChange('activationWorld', value)}
          />
          {formErrors.activationWorld && (
            <Text style={styles.errorText}>{formErrors.activationWorld}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={[styles.promptInput, formErrors.prompt && styles.inputError]}
            placeholder="Enter the ability prompt..."
            placeholderTextColor="#666"
            value={abilityStateFormData.prompt}
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
            value={abilityStateFormData.observation}
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

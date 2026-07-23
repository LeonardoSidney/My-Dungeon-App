import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { World } from '@domain/entities';
import { styles } from './styles';

type WorldFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (world: {
    name: string;
    activationWord: string;
    prompt: string;
    observation?: string;
  }) => void;
  initialData?: World | null;
};

export function WorldForm ({
  visible,
  onClose,
  onSave,
  initialData
}: WorldFormProps) {
  const [name, setName] = React.useState(initialData?.name || '');
  const [activationWord, setActivationWord] = React.useState(initialData?.activationWord || '');
  const [prompt, setPrompt] = React.useState(initialData?.prompt || '');
  const [observation, setObservation] = React.useState(initialData?.observation || '');
  const [loading, setLoading] = React.useState(false);

  const handleSave = async () => {
    if (!name.trim() || !activationWord.trim() || !prompt.trim()) return;

    setLoading(true);
    try {
      onSave({
        name: name.trim(),
        activationWord: activationWord.trim(),
        prompt: prompt.trim(),
        observation: observation.trim() || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isEditing = initialData !== null;

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit World' : 'New World'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, !name.trim() && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Fantasy World"
            placeholderTextColor="#666"
          />
          {!name.trim() && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activation Word</Text>
          <TextInput
            style={[styles.input, !activationWord.trim() && styles.inputError]}
            value={activationWord}
            onChangeText={setActivationWord}
            placeholder="e.g., Dungeon"
            placeholderTextColor="#666"
          />
          {!activationWord.trim() && (
            <Text style={styles.errorText}>Activation word is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prompt</Text>
          <TextInput
            style={[styles.input, !prompt.trim() && styles.inputError, styles.promptInput]}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter the world prompt..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />
          {!prompt.trim() && (
            <Text style={styles.errorText}>Prompt is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={[styles.input, styles.observationInput]}
            value={observation}
            onChangeText={setObservation}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formActions}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.cancelButton}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            disabled={loading}
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

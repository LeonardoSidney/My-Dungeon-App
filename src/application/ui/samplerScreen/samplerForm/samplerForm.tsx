import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Sampler } from '@domain/entities';
import { styles } from './styles';
import { useSamplerForm } from './useSamplerForm';

type SamplerFormProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (sampler: Omit<Sampler, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Sampler | null;
  resetKey: number;
};

export function SamplerForm ({
  visible,
  onClose,
  onSave,
  initialData,
  resetKey
}: SamplerFormProps) {
  const resolvedInitialData: Sampler | null = initialData || null;

  const {
    formState,
    loading,
    updateField,
    setMirostat,
    resetForm,
    handleSave,
  } = useSamplerForm(resolvedInitialData, resetKey);

  const isEditing = resolvedInitialData !== null;

  const handleSaveWrapper = () => {
    handleSave(onSave, onClose);
  };

  if (!visible) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.form}>
        <View style={styles.formHeader}>
          <Text style={styles.formTitle}>
            {isEditing ? 'Edit Sampler' : 'New Sampler'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, !formState.name.trim() && styles.inputError]}
            value={formState.name}
            onChangeText={(value) => updateField('name', value)}
            placeholder="e.g., Default Sampler"
            placeholderTextColor="#666"
          />
          {!formState.name.trim() && (
            <Text style={styles.errorText}>Name is required</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={styles.input}
            value={formState.observation}
            onChangeText={(value) => updateField('observation', value)}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Generation Settings</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Temperature</Text>
            <TextInput
              style={styles.input}
              value={formState.temperature}
              onChangeText={(value) => updateField('temperature', value)}
              placeholder="1.0"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Top P</Text>
            <TextInput
              style={styles.input}
              value={formState.topP}
              onChangeText={(value) => updateField('topP', value)}
              placeholder="0.95"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Top K</Text>
            <TextInput
              style={styles.input}
              value={formState.topK}
              onChangeText={(value) => updateField('topK', value)}
              placeholder="40"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Min P</Text>
            <TextInput
              style={styles.input}
              value={formState.minP}
              onChangeText={(value) => updateField('minP', value)}
              placeholder="0.1"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Repeat Last N</Text>
            <TextInput
              style={styles.input}
              value={formState.repeatLastN}
              onChangeText={(value) => updateField('repeatLastN', value)}
              placeholder="-1"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Repeat Penalty</Text>
            <TextInput
              style={styles.input}
              value={formState.repeatPenalty}
              onChangeText={(value) => updateField('repeatPenalty', value)}
              placeholder="1.1"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Frequency Penalty</Text>
            <TextInput
              style={styles.input}
              value={formState.frequencyPenalty}
              onChangeText={(value) => updateField('frequencyPenalty', value)}
              placeholder="0.0"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Presence Penalty</Text>
            <TextInput
              style={styles.input}
              value={formState.presencePenalty}
              onChangeText={(value) => updateField('presencePenalty', value)}
              placeholder="0.0"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mirostat</Text>
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                formState.mirostat === 0 && styles.dropdownOptionSelected
              ]}
              onPress={() => setMirostat(0)}
            >
              <Text style={styles.dropdownOptionText}>Disabled</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                formState.mirostat === 1 && styles.dropdownOptionSelected
              ]}
              onPress={() => setMirostat(1)}
            >
              <Text style={styles.dropdownOptionText}>Mirostat 1.0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                formState.mirostat === 2 && styles.dropdownOptionSelected
              ]}
              onPress={() => setMirostat(2)}
            >
              <Text style={styles.dropdownOptionText}>Mirostat 2.0</Text>
            </TouchableOpacity>
          </View>
        </View>

        {formState.mirostat !== undefined && formState.mirostat !== 0 && (
          <>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Mirostat Eta</Text>
                <TextInput
                  style={styles.input}
                  value={formState.mirostatEnt}
                  onChangeText={(value) => updateField('mirostatEnt', value)}
                  placeholder="0.1"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Mirostat Tau</Text>
                <TextInput
                  style={styles.input}
                  value={formState.mirostatLr}
                  onChangeText={(value) => updateField('mirostatLr', value)}
                  placeholder="5.0"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Seed (optional)</Text>
          <TextInput
            style={styles.input}
            value={formState.seed}
            onChangeText={(value) => updateField('seed', value)}
            placeholder="Random if empty"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>Advanced Settings</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dry Allowed Length</Text>
            <TextInput
              style={styles.input}
              value={formState.dryAllowedLenght}
              onChangeText={(value) => updateField('dryAllowedLenght', value)}
              placeholder="3"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dry Base</Text>
            <TextInput
              style={styles.input}
              value={formState.dryBase}
              onChangeText={(value) => updateField('dryBase', value)}
              placeholder="1.7"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dry Multiplier</Text>
            <TextInput
              style={styles.input}
              value={formState.dryMultiplier}
              onChangeText={(value) => updateField('dryMultiplier', value)}
              placeholder="0.4"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dyna Temp Exp</Text>
            <TextInput
              style={styles.input}
              value={formState.dynaTempExp}
              onChangeText={(value) => updateField('dynaTempExp', value)}
              placeholder="1.0"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dyna Temp Range</Text>
            <TextInput
              style={styles.input}
              value={formState.dynaTempRange}
              onChangeText={(value) => updateField('dynaTempRange', value)}
              placeholder="0"
              placeholderTextColor="#666"
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>XTC Probability</Text>
            <TextInput
              style={styles.input}
              value={formState.xtcProbability}
              onChangeText={(value) => updateField('xtcProbability', value)}
              placeholder="0.1"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>XTC Threshold</Text>
          <TextInput
            style={styles.input}
            value={formState.xtcThreshould}
            onChangeText={(value) => updateField('xtcThreshould', value)}
            placeholder="0.5"
            placeholderTextColor="#666"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Top N Sigma</Text>
            <TextInput
              style={styles.input}
              value={formState.topNSigma}
              onChangeText={(value) => updateField('topNSigma', value)}
              placeholder="2.5"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Typical P</Text>
            <TextInput
              style={styles.input}
              value={formState.typicalP}
              onChangeText={(value) => updateField('typicalP', value)}
              placeholder="1.0"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Adaptative Decay</Text>
            <TextInput
              style={styles.input}
              value={formState.adaptativeDecay}
              onChangeText={(value) => updateField('adaptativeDecay', value)}
              placeholder="1.1"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Adaptative Target</Text>
            <TextInput
              style={styles.input}
              value={formState.adaptativeTarget}
              onChangeText={(value) => updateField('adaptativeTarget', value)}
              placeholder="5.0"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dry Sequence Breakers (optional)</Text>
          <TextInput
            style={styles.input}
            value={formState.drySequenceBreakers}
            onChangeText={(value) => updateField('drySequenceBreakers', value)}
            placeholder="\\n, \\n\\n, <|endoftext|>"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ignore EOS</Text>
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                formState.ignoreEOS === 'true' && styles.dropdownOptionSelected
              ]}
              onPress={() => updateField('ignoreEOS', 'true')}
            >
              <Text style={styles.dropdownOptionText}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                formState.ignoreEOS === 'false' && styles.dropdownOptionSelected
              ]}
              onPress={() => updateField('ignoreEOS', 'false')}
            >
              <Text style={styles.dropdownOptionText}>False</Text>
            </TouchableOpacity>
          </View>
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
            onPress={handleSaveWrapper}
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

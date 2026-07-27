import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { MirostatEnum } from '@domain/entities';
import { styles } from './styles';
import { SamplerFormProps } from './constants';

export function SamplerForm (params: SamplerFormProps) {
  const { showForm, samplerStateFormData, onChange, onCancel, onSave, formErrors } = params;

  if (!showForm) {
    return <></>;
  }

  const title = samplerStateFormData.id ? 'Edit Sampler' : 'Add Sampler';
  const saveText = samplerStateFormData.id ? 'Save' : 'Create';

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
            placeholder="e.g., Default Sampler"
            placeholderTextColor="#666"
            value={samplerStateFormData.name}
            onChangeText={(value) => onChange('name', value)}
          />
          {formErrors.name && (
            <Text style={styles.errorText}>{formErrors.name}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Observation (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Additional observations..."
            placeholderTextColor="#666"
            value={samplerStateFormData.observation}
            onChangeText={(value) => onChange('observation', value)}
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
              placeholder="1.0"
              placeholderTextColor="#666"
              value={samplerStateFormData.temperature}
              onChangeText={(value) => onChange('temperature', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Top P</Text>
            <TextInput
              style={styles.input}
              placeholder="0.95"
              placeholderTextColor="#666"
              value={samplerStateFormData.topP}
              onChangeText={(value) => onChange('topP', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Top K</Text>
            <TextInput
              style={styles.input}
              placeholder="40"
              placeholderTextColor="#666"
              value={samplerStateFormData.topK}
              onChangeText={(value) => onChange('topK', value)}
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Min P</Text>
            <TextInput
              style={styles.input}
              placeholder="0.1"
              placeholderTextColor="#666"
              value={samplerStateFormData.minP}
              onChangeText={(value) => onChange('minP', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Repeat Last N</Text>
            <TextInput
              style={styles.input}
              placeholder="-1"
              placeholderTextColor="#666"
              value={samplerStateFormData.repeatLastN}
              onChangeText={(value) => onChange('repeatLastN', value)}
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Repeat Penalty</Text>
            <TextInput
              style={styles.input}
              placeholder="1.1"
              placeholderTextColor="#666"
              value={samplerStateFormData.repeatPenalty}
              onChangeText={(value) => onChange('repeatPenalty', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Frequency Penalty</Text>
            <TextInput
              style={styles.input}
              placeholder="0.0"
              placeholderTextColor="#666"
              value={samplerStateFormData.frequencyPenalty}
              onChangeText={(value) => onChange('frequencyPenalty', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Presence Penalty</Text>
            <TextInput
              style={styles.input}
              placeholder="0.0"
              placeholderTextColor="#666"
              value={samplerStateFormData.presencePenalty}
              onChangeText={(value) => onChange('presencePenalty', value)}
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
                samplerStateFormData.mirostat === 0 && styles.dropdownOptionSelected
              ]}
              onPress={() => onChange('mirostat', 0 as MirostatEnum)}
            >
              <Text style={styles.dropdownOptionText}>Disabled</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                samplerStateFormData.mirostat === 1 && styles.dropdownOptionSelected
              ]}
              onPress={() => onChange('mirostat', 1 as MirostatEnum)}
            >
              <Text style={styles.dropdownOptionText}>Mirostat 1.0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                samplerStateFormData.mirostat === 2 && styles.dropdownOptionSelected
              ]}
              onPress={() => onChange('mirostat', 2 as MirostatEnum)}
            >
              <Text style={styles.dropdownOptionText}>Mirostat 2.0</Text>
            </TouchableOpacity>
          </View>
        </View>

        {samplerStateFormData.mirostat !== undefined && samplerStateFormData.mirostat !== 0 && (
          <>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Mirostat Eta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.1"
                  placeholderTextColor="#666"
                  value={samplerStateFormData.mirostatEnt}
                  onChangeText={(value) => onChange('mirostatEnt', value)}
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Mirostat Tau</Text>
                <TextInput
                  style={styles.input}
                  placeholder="5.0"
                  placeholderTextColor="#666"
                  value={samplerStateFormData.mirostatLr}
                  onChangeText={(value) => onChange('mirostatLr', value)}
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
            placeholder="Random if empty"
            placeholderTextColor="#666"
            value={samplerStateFormData.seed}
            onChangeText={(value) => onChange('seed', value)}
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
              placeholder="3"
              placeholderTextColor="#666"
              value={samplerStateFormData.dryAllowedLenght}
              onChangeText={(value) => onChange('dryAllowedLenght', value)}
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dry Base</Text>
            <TextInput
              style={styles.input}
              placeholder="1.7"
              placeholderTextColor="#666"
              value={samplerStateFormData.dryBase}
              onChangeText={(value) => onChange('dryBase', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dry Multiplier</Text>
            <TextInput
              style={styles.input}
              placeholder="0.4"
              placeholderTextColor="#666"
              value={samplerStateFormData.dryMultiplier}
              onChangeText={(value) => onChange('dryMultiplier', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dyna Temp Exp</Text>
            <TextInput
              style={styles.input}
              placeholder="1.0"
              placeholderTextColor="#666"
              value={samplerStateFormData.dynaTempExp}
              onChangeText={(value) => onChange('dynaTempExp', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Dyna Temp Range</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#666"
              value={samplerStateFormData.dynaTempRange}
              onChangeText={(value) => onChange('dynaTempRange', value)}
              keyboardType="number-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>XTC Probability</Text>
            <TextInput
              style={styles.input}
              placeholder="0.1"
              placeholderTextColor="#666"
              value={samplerStateFormData.xtcProbability}
              onChangeText={(value) => onChange('xtcProbability', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>XTC Threshold</Text>
          <TextInput
            style={styles.input}
            placeholder="0.5"
            placeholderTextColor="#666"
            value={samplerStateFormData.xtcThreshould}
            onChangeText={(value) => onChange('xtcThreshould', value)}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Top N Sigma</Text>
            <TextInput
              style={styles.input}
              placeholder="2.5"
              placeholderTextColor="#666"
              value={samplerStateFormData.topNSigma}
              onChangeText={(value) => onChange('topNSigma', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Typical P</Text>
            <TextInput
              style={styles.input}
              placeholder="1.0"
              placeholderTextColor="#666"
              value={samplerStateFormData.typicalP}
              onChangeText={(value) => onChange('typicalP', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Adaptative Decay</Text>
            <TextInput
              style={styles.input}
              placeholder="1.1"
              placeholderTextColor="#666"
              value={samplerStateFormData.adaptativeDecay}
              onChangeText={(value) => onChange('adaptativeDecay', value)}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={[styles.inputGroup, styles.halfWidth]}>
            <Text style={styles.label}>Adaptative Target</Text>
            <TextInput
              style={styles.input}
              placeholder="5.0"
              placeholderTextColor="#666"
              value={samplerStateFormData.adaptativeTarget}
              onChangeText={(value) => onChange('adaptativeTarget', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dry Sequence Breakers (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="\\n, \\n\\n,  "
            placeholderTextColor="#666"
            value={samplerStateFormData.drySequenceBreakers}
            onChangeText={(value) => onChange('drySequenceBreakers', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ignore EOS</Text>
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                samplerStateFormData.ignoreEOS === 'true' && styles.dropdownOptionSelected
              ]}
              onPress={() => onChange('ignoreEOS', 'true')}
            >
              <Text style={styles.dropdownOptionText}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                samplerStateFormData.ignoreEOS === 'false' && styles.dropdownOptionSelected
              ]}
              onPress={() => onChange('ignoreEOS', 'false')}
            >
              <Text style={styles.dropdownOptionText}>False</Text>
            </TouchableOpacity>
          </View>
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

import React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { MirostatEnum } from '@domain/entities';
import { styles } from './styles';
import { colors } from '../../theme';
import { SingleSelect } from '@application/ui/components';
import { SamplerFormProps } from './constants';

type MirostatOption = {
  id: string;
  label: string;
  value: MirostatEnum;
};

const mirostatOptions: MirostatOption[] = [
  { id: '0', label: 'Disabled', value: MirostatEnum.DEFAULT },
  { id: '1', label: 'Mirostat 1.0', value: MirostatEnum.MIROSTAT1 },
  { id: '2', label: 'Mirostat 2.0', value: MirostatEnum.MIROSTAT2 },
];

type IgnoreEOSOption = {
  id: string;
  label: string;
};

const ignoreEOSOptions: IgnoreEOSOption[] = [
  { id: 'true', label: 'True' },
  { id: 'false', label: 'False' },
];

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
            placeholderTextColor={colors.placeholder}
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
            placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
              value={samplerStateFormData.presencePenalty}
              onChangeText={(value) => onChange('presencePenalty', value)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mirostat</Text>
          <SingleSelect
            items={mirostatOptions}
            selectedId={samplerStateFormData.mirostat?.toString()}
            renderLabel={option => option.label}
            onSelect={option => onChange('mirostat', option.value)}
          />
        </View>

        {samplerStateFormData.mirostat !== undefined && samplerStateFormData.mirostat !== 0 && (
          <>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Mirostat Eta</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.1"
                  placeholderTextColor={colors.placeholder}
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
                  placeholderTextColor={colors.placeholder}
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
            placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
            placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
              placeholderTextColor={colors.placeholder}
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
            placeholderTextColor={colors.placeholder}
            value={samplerStateFormData.drySequenceBreakers}
            onChangeText={(value) => onChange('drySequenceBreakers', value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ignore EOS</Text>
          <SingleSelect
            items={ignoreEOSOptions}
            selectedId={samplerStateFormData.ignoreEOS}
            renderLabel={option => option.label}
            onSelect={option => onChange('ignoreEOS', option.id)}
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

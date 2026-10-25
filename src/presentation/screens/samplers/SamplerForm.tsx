import { StyleSheet, Text, View, type KeyboardTypeOptions } from 'react-native';
import { MirostatEnum } from '@domain/entities';
import { FormCard, FormField, SingleSelect, TextField } from '@presentation/components';
import { colors } from '@presentation/theme';
import type { SamplerFormData, SamplerFormErrors } from './samplerForm';

type TextFieldKey = Exclude<keyof SamplerFormData, 'id' | 'mirostat'>;

type NumberField = {
  key: TextFieldKey;
  label: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
};

type FieldRow = NumberField[];

const decimal = (key: TextFieldKey, label: string, placeholder: string): NumberField => ({ key, label, placeholder, keyboardType: 'decimal-pad' });
const integer = (key: TextFieldKey, label: string, placeholder: string): NumberField => ({ key, label, placeholder, keyboardType: 'number-pad' });

const generationRows: FieldRow[] = [
  [decimal('temperature', 'Temperature', '1.0'), decimal('topP', 'Top P', '0.95')],
  [integer('topK', 'Top K', '40'), decimal('minP', 'Min P', '0.1')],
  [integer('repeatLastN', 'Repeat Last N', '-1'), decimal('repeatPenalty', 'Repeat Penalty', '1.1')],
  [decimal('frequencyPenalty', 'Frequency Penalty', '0.0'), decimal('presencePenalty', 'Presence Penalty', '0.0')],
];

const mirostatRow: FieldRow = [decimal('mirostatEnt', 'Mirostat Eta', '0.1'), decimal('mirostatLr', 'Mirostat Tau', '5.0')];

const advancedRows: FieldRow[] = [
  [integer('dryAllowedLenght', 'Dry Allowed Length', '3'), decimal('dryBase', 'Dry Base', '1.7')],
  [decimal('dryMultiplier', 'Dry Multiplier', '0.4'), decimal('dynaTempExp', 'Dyna Temp Exp', '1.0')],
  [integer('dynaTempRange', 'Dyna Temp Range', '0'), decimal('xtcProbability', 'XTC Probability', '0.1')],
  [decimal('xtcThreshould', 'XTC Threshold', '0.5')],
  [decimal('topNSigma', 'Top N Sigma', '2.5'), decimal('typicalP', 'Typical P', '1.0')],
  [decimal('adaptativeDecay', 'Adaptative Decay', '1.1'), decimal('adaptativeTarget', 'Adaptative Target', '5.0')],
];

const mirostatOptions = [
  { id: '0', label: 'Disabled', value: MirostatEnum.DEFAULT },
  { id: '1', label: 'Mirostat 1.0', value: MirostatEnum.MIROSTAT1 },
  { id: '2', label: 'Mirostat 2.0', value: MirostatEnum.MIROSTAT2 },
];

const ignoreEOSOptions = [
  { id: 'true', label: 'True' },
  { id: 'false', label: 'False' },
];

type SamplerFormProps = {
  formData: SamplerFormData;
  formErrors: SamplerFormErrors;
  onChange: <K extends keyof SamplerFormData>(field: K, value: SamplerFormData[K]) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function SamplerForm ({ formData, formErrors, onChange, onCancel, onSave }: SamplerFormProps) {
  const isEditing = Boolean(formData.id);
  const isMirostatEnabled = formData.mirostat !== undefined && formData.mirostat !== MirostatEnum.DEFAULT;

  const renderRow = (row: FieldRow) => (
    <View key={row[0].key} style={styles.row}>
      {row.map(field => (
        <View key={field.key} style={styles.column}>
          <TextField
            label={field.label}
            placeholder={field.placeholder}
            keyboardType={field.keyboardType}
            value={formData[field.key]}
            onChangeText={value => onChange(field.key, value)}
          />
        </View>
      ))}
    </View>
  );

  return (
    <FormCard
      title={isEditing ? 'Edit Sampler' : 'Add Sampler'}
      saveLabel={isEditing ? 'Save' : 'Create'}
      onCancel={onCancel}
      onSave={onSave}
    >
      <TextField
        label="Name"
        placeholder="e.g., Default Sampler"
        value={formData.name}
        onChangeText={value => onChange('name', value)}
        error={formErrors.name}
      />
      <TextField
        label="Observation (optional)"
        variant="multiline"
        placeholder="Additional observations..."
        value={formData.observation}
        onChangeText={value => onChange('observation', value)}
      />

      <SectionTitle title="Generation Settings" />
      {generationRows.map(renderRow)}

      <FormField label="Mirostat">
        <SingleSelect
          items={mirostatOptions}
          selectedId={formData.mirostat?.toString()}
          renderLabel={option => option.label}
          onSelect={option => onChange('mirostat', option.value)}
        />
      </FormField>
      {isMirostatEnabled && renderRow(mirostatRow)}

      <TextField
        label="Seed (optional)"
        placeholder="Random if empty"
        value={formData.seed}
        onChangeText={value => onChange('seed', value)}
      />

      <SectionTitle title="Advanced Settings" />
      {advancedRows.map(renderRow)}

      <TextField
        label="Dry Sequence Breakers (optional)"
        placeholder="\\n, \\n\\n,  "
        value={formData.drySequenceBreakers}
        onChangeText={value => onChange('drySequenceBreakers', value)}
      />

      <FormField label="Ignore EOS">
        <SingleSelect
          items={ignoreEOSOptions}
          selectedId={formData.ignoreEOS}
          renderLabel={option => option.label}
          onSelect={option => onChange('ignoreEOS', option.id)}
        />
      </FormField>
    </FormCard>
  );
}

function SectionTitle ({ title }: { title: string; }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionTitleText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
});

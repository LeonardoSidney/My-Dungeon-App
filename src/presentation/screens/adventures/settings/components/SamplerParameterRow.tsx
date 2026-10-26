import { StyleSheet, Text, TextInput, TouchableOpacity, View, type KeyboardTypeOptions } from 'react-native';
import { formStyles, SegmentedControl } from '@presentation/components';
import { colors } from '@presentation/theme';
import { isChoiceField, SamplerFieldKindEnum, type SamplerFieldKind, type SamplerFieldSpec } from '../samplerValues';

type SamplerParameterRowProps = {
  spec: SamplerFieldSpec;
  value: string;
  savedValue: string;
  savedLabel: string;
  error?: string;
  isLocked: boolean;
  onChange: (value: string) => void;
};

const keyboardTypes: Record<SamplerFieldKind, KeyboardTypeOptions> = {
  [SamplerFieldKindEnum.DECIMAL]: 'numeric',
  [SamplerFieldKindEnum.INTEGER]: 'numeric',
  [SamplerFieldKindEnum.SEED]: 'numeric',
  [SamplerFieldKindEnum.TEXT]: 'default',
  [SamplerFieldKindEnum.BOOLEAN]: 'default',
  [SamplerFieldKindEnum.MIROSTAT]: 'default',
};

export function SamplerParameterRow ({ spec, value, savedValue, savedLabel, error, isLocked, onChange }: SamplerParameterRowProps) {
  const isChanged = value !== savedValue;
  const isChoice = isChoiceField(spec);
  const selectedChoice = value || spec.defaultChoice || '';

  return (
    <View style={styles.row}>
      <View style={styles.main}>
        <View style={styles.texts}>
          <Text style={styles.label}>{spec.label}</Text>
          {isChanged && <Text style={styles.savedValue}>{`Saved: ${savedLabel}`}</Text>}
        </View>

        {isChoice && (
          <View style={styles.choice}>
            <SegmentedControl options={spec.choices ?? []} value={selectedChoice} onChange={onChange} disabled={isLocked} />
          </View>
        )}

        {!isChoice && (
          <TextInput
            style={[
              formStyles.input,
              styles.input,
              spec.kind === SamplerFieldKindEnum.TEXT && styles.textInput,
              isChanged && styles.inputChanged,
              Boolean(error) && formStyles.inputError,
            ]}
            value={value}
            onChangeText={onChange}
            placeholder="default"
            placeholderTextColor={colors.placeholder}
            editable={!isLocked}
            keyboardType={keyboardTypes[spec.kind]}
            accessibilityLabel={spec.label}
          />
        )}

        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => onChange(savedValue)}
          disabled={!isChanged}
          accessibilityRole="button"
          accessibilityLabel={`Reset ${spec.label}`}
        >
          <Text style={[styles.resetText, !isChanged && styles.resetTextHidden]}>↺</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={formStyles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  texts: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  savedValue: {
    fontSize: 12,
    color: colors.textSubtle,
  },
  choice: {
    width: 150,
  },
  input: {
    width: 90,
    paddingVertical: 8,
    textAlign: 'right',
  },
  textInput: {
    width: 150,
    textAlign: 'left',
  },
  inputChanged: {
    borderColor: colors.primary,
  },
  resetButton: {
    padding: 6,
  },
  resetText: {
    fontSize: 16,
    color: colors.accentBlue,
  },
  resetTextHidden: {
    opacity: 0,
  },
});

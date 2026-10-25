import { TextInput, type KeyboardTypeOptions } from 'react-native';
import { colors } from '@presentation/theme';
import { FormField } from './FormField';
import { formStyles } from './formStyles';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  error?: string;
  variant?: 'singleLine' | 'multiline' | 'tall';
  keyboardType?: KeyboardTypeOptions;
};

export function TextField ({ label, value, onChangeText, placeholder, error, variant = 'singleLine', keyboardType }: TextFieldProps) {
  const isMultiline = variant !== 'singleLine';

  return (
    <FormField label={label} error={error}>
      <TextInput
        style={[
          formStyles.input,
          isMultiline && formStyles.multilineInput,
          variant === 'tall' && formStyles.tallInput,
          Boolean(error) && formStyles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={isMultiline}
        keyboardType={keyboardType}
      />
    </FormField>
  );
}

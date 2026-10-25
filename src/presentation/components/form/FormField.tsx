import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { screenStyles } from '../screenStyles';
import { formStyles } from './formStyles';

type FormFieldProps = {
  label: string;
  error?: string;
  loadError?: string;
  children: ReactNode;
};

export function FormField ({ label, error, loadError, children }: FormFieldProps) {
  if (loadError) {
    return <Text style={screenStyles.errorText}>{loadError}</Text>;
  }

  return (
    <View style={formStyles.inputGroup}>
      <Text style={formStyles.label}>{label}</Text>
      {children}
      {error && <Text style={formStyles.errorText}>{error}</Text>}
    </View>
  );
}

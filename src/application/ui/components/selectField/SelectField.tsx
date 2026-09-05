import React from 'react';
import { Text, View } from 'react-native';
import { formStyles } from '../formStyles';

export type SelectFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function SelectField ({ label, error, children }: SelectFieldProps) {
  return (
    <View style={formStyles.inputGroup}>
      <Text style={formStyles.label}>{label}</Text>
      {children}
      {error && <Text style={formStyles.errorText}>{error}</Text>}
    </View>
  );
}

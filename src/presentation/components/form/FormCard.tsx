import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { formStyles } from './formStyles';

type FormCardProps = {
  title: string;
  saveLabel: string;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  children: ReactNode;
};

export function FormCard ({ title, saveLabel, onCancel, onSave, isSaving = false, children }: FormCardProps) {
  return (
    <View style={formStyles.container}>
      <View style={formStyles.form}>
        <View style={formStyles.formHeader}>
          <Text style={formStyles.formTitle}>{title}</Text>
          <TouchableOpacity onPress={onCancel} style={formStyles.closeButton}>
            <Text style={formStyles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {children}

        <View style={formStyles.formActions}>
          <TouchableOpacity style={formStyles.cancelButton} onPress={onCancel} disabled={isSaving}>
            <Text style={formStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[formStyles.saveButton, isSaving && formStyles.saveButtonDisabled]}
            onPress={onSave}
            disabled={isSaving}
          >
            <Text style={formStyles.saveButtonText}>{isSaving ? 'Saving...' : saveLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

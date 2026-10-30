import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CollapsibleSection, formStyles, screenStyles, TextField } from '@presentation/components';
import { ChatTemplateDefinitions, ChatTemplateFieldErrors, ChatTemplateKey, ChatTemplateOverrides } from '@domain/entities';
import { ChatTemplateField, formatAcceptedTags } from './chatTemplatesForm';
import { getSaveLabel } from './saveLabel';
import { settingsPanelStyles } from './settingsPanel.styles';

type ChatTemplatesPanelProps = {
  title: string;
  helpText: string;
  fields: ChatTemplateField[];
  templates: ChatTemplateOverrides;
  definitions?: ChatTemplateDefinitions;
  errors: ChatTemplateFieldErrors;
  loadError?: string;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onChange: (key: ChatTemplateKey, value: string) => void;
  onRestoreDefault: (key: ChatTemplateKey) => void;
  onSave: () => void;
};

export function ChatTemplatesPanel ({
  title,
  helpText,
  fields,
  templates,
  definitions,
  errors,
  loadError,
  isLoading,
  isSaving,
  hasUnsavedChanges,
  onChange,
  onRestoreDefault,
  onSave,
}: ChatTemplatesPanelProps) {
  const isSaveDisabled = isSaving || !hasUnsavedChanges;

  const renderField = (field: ChatTemplateField, fieldDefinitions: ChatTemplateDefinitions) => (
    <View key={field.key} style={styles.field}>
      <TextField
        label={field.label}
        value={templates[field.key] ?? ''}
        onChangeText={value => onChange(field.key, value)}
        error={errors[field.key]}
        variant="tall"
      />
      <Text style={styles.tagsText}>{formatAcceptedTags(fieldDefinitions[field.key])}</Text>
      <View style={settingsPanelStyles.actions}>
        <TouchableOpacity style={formStyles.cancelButton} onPress={() => onRestoreDefault(field.key)} disabled={isSaving}>
          <Text style={formStyles.cancelButtonText}>Restore default</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return <Text style={screenStyles.loadingText}>Loading...</Text>;
    }
    if (loadError || !definitions) {
      return <Text style={screenStyles.errorText}>{loadError}</Text>;
    }
    return (
      <>
        <Text style={settingsPanelStyles.helpText}>{helpText}</Text>
        {fields.map(field => renderField(field, definitions))}
        {hasUnsavedChanges && <Text style={settingsPanelStyles.unsavedText}>Unsaved changes</Text>}
        <View style={settingsPanelStyles.actions}>
          <TouchableOpacity
            style={[formStyles.saveButton, isSaveDisabled && formStyles.saveButtonDisabled]}
            onPress={onSave}
            disabled={isSaveDisabled}
          >
            <Text style={formStyles.saveButtonText}>{getSaveLabel(isSaving, hasUnsavedChanges)}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <CollapsibleSection title={title}>
      {renderContent()}
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  tagsText: {
    ...settingsPanelStyles.helpText,
    fontSize: 12,
    marginBottom: 8,
  },
});

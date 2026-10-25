import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formStyles, screenStyles, TextField } from '@presentation/components';
import { colors } from '@presentation/theme';
import { CollapsibleSection } from './CollapsibleSection';

type SystemPromptLoadOrderPanelProps = {
  loadOrder: string;
  error?: string;
  loadError?: string;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  onRestoreDefault: () => void;
};

function getSaveLabel (isSaving: boolean, hasUnsavedChanges: boolean): string {
  if (isSaving) {
    return 'Saving...';
  }
  if (hasUnsavedChanges) {
    return 'Save';
  }
  return 'Saved ✓';
}

export function SystemPromptLoadOrderPanel ({
  loadOrder,
  error,
  loadError,
  isLoading,
  isSaving,
  hasUnsavedChanges,
  onChange,
  onSave,
  onRestoreDefault,
}: SystemPromptLoadOrderPanelProps) {
  const isSaveDisabled = isSaving || !hasUnsavedChanges;

  const renderContent = () => {
    if (isLoading) {
      return <Text style={screenStyles.loadingText}>Loading...</Text>;
    }
    if (loadError) {
      return <Text style={screenStyles.errorText}>{loadError}</Text>;
    }
    return (
      <>
        <Text style={styles.helpText}>
          Chain the tags in the order they are injected into the system prompt. Remove a tag to leave its section out.
          Spaces and line breaks are ignored.
        </Text>
        <TextField label="Load order" value={loadOrder} onChangeText={onChange} error={error} variant="tall" />
        {hasUnsavedChanges && <Text style={styles.unsavedText}>Unsaved changes</Text>}
        <View style={styles.actions}>
          <TouchableOpacity style={formStyles.cancelButton} onPress={onRestoreDefault} disabled={isSaving}>
            <Text style={formStyles.cancelButtonText}>Restore default</Text>
          </TouchableOpacity>
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
    <CollapsibleSection title="System Prompt Load Order">
      {renderContent()}
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  helpText: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  unsavedText: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
});

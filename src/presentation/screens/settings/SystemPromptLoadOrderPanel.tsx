import { Text, TouchableOpacity, View } from 'react-native';
import { CollapsibleSection, formStyles, screenStyles, TextField } from '@presentation/components';
import { getSaveLabel } from './saveLabel';
import { settingsPanelStyles } from './settingsPanel.styles';

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
        <Text style={settingsPanelStyles.helpText}>
          Chain the tags in the order they are injected into the system prompt. Remove a tag to leave its section out.
          Spaces and line breaks are ignored.
        </Text>
        <TextField label="Load order" value={loadOrder} onChangeText={onChange} error={error} variant="tall" />
        {hasUnsavedChanges && <Text style={settingsPanelStyles.unsavedText}>Unsaved changes</Text>}
        <View style={settingsPanelStyles.actions}>
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

import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { screenStyles } from '@presentation/components';
import { useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { showError } from '@presentation/utils/showError';
import { ChatTemplatesPanel } from './ChatTemplatesPanel';
import { ConnectionForm } from './ConnectionForm';
import { ConnectionPanel } from './ConnectionPanel';
import { DangerZone } from './DangerZone';
import { SystemPromptLoadOrderPanel } from './SystemPromptLoadOrderPanel';
import { SYSTEM_PROMPT_SECTION_FIELDS, TURN_TEMPLATE_FIELDS } from './chatTemplatesForm';
import { initialConnectionForm, submitConnection, toConnectionFormState, validateConnectionForm } from './connectionForm';
import { useChatTemplates } from './useChatTemplates';
import { useSystemPromptLoadOrder } from './useSystemPromptLoadOrder';

export function SettingsScreen () {
  const {
    createConnectionConfig,
    editConnection,
    eraseAdventures,
    eraseConnection,
    getConnections,
    getConnection,
    getSystemPromptLoadOrder,
    saveSystemPromptLoadOrder,
    resetSystemPromptLoadOrder,
    getChatTemplates,
    saveChatTemplates,
    alert,
  } = useControllers();
  const [isErasing, setIsErasing] = useState(false);

  const connections = useEntityScreen({
    fetch: () => getConnections.handle(),
    load: id => getConnection.handle({ id }),
    submit: form => submitConnection(form, createConnectionConfig, editConnection),
    erase: id => eraseConnection.handle({ id }),
    toFormState: toConnectionFormState,
    initialForm: initialConnectionForm,
    validate: validateConnectionForm,
    entityName: 'connection',
    alert,
  });

  const systemPromptLoadOrder = useSystemPromptLoadOrder({
    getSystemPromptLoadOrder,
    saveSystemPromptLoadOrder,
    resetSystemPromptLoadOrder,
    alert,
  });

  const turnTemplates = useChatTemplates({ fields: TURN_TEMPLATE_FIELDS, getChatTemplates, saveChatTemplates, alert });
  const systemPromptSections = useChatTemplates({ fields: SYSTEM_PROMPT_SECTION_FIELDS, getChatTemplates, saveChatTemplates, alert });

  const eraseAllAdventures = async () => {
    setIsErasing(true);
    const response = await eraseAdventures.handle();
    setIsErasing(false);
    if (!response.success) {
      showError(alert, response.error, 'Failed to erase adventures');
    }
  };

  return (
    <View style={screenStyles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
        <ConnectionPanel
          connections={connections.entities}
          isLoading={connections.isLoading}
          isError={connections.isError}
          onAdd={connections.openAdd}
          onEdit={connections.openEdit}
          onDelete={connections.eraseEntity}
        />
        {connections.showForm && (
          <ConnectionForm
            formData={connections.form}
            errors={connections.formErrors}
            onChange={connections.updateField}
            onCancel={connections.closeForm}
            onSave={connections.save}
          />
        )}
        <SystemPromptLoadOrderPanel
          loadOrder={systemPromptLoadOrder.loadOrder}
          error={systemPromptLoadOrder.error}
          loadError={systemPromptLoadOrder.loadError}
          isLoading={systemPromptLoadOrder.isLoading}
          isSaving={systemPromptLoadOrder.isSaving}
          hasUnsavedChanges={systemPromptLoadOrder.hasUnsavedChanges}
          onChange={systemPromptLoadOrder.changeLoadOrder}
          onSave={systemPromptLoadOrder.save}
          onRestoreDefault={systemPromptLoadOrder.restoreDefault}
        />
        <ChatTemplatesPanel
          title="Turn Messages"
          helpText="How each turn is written to the model. Line breaks are kept. Only the listed tags are accepted."
          fields={TURN_TEMPLATE_FIELDS}
          templates={turnTemplates.templates}
          definitions={turnTemplates.definitions}
          errors={turnTemplates.errors}
          loadError={turnTemplates.loadError}
          isLoading={turnTemplates.isLoading}
          isSaving={turnTemplates.isSaving}
          hasUnsavedChanges={turnTemplates.hasUnsavedChanges}
          onChange={turnTemplates.changeTemplate}
          onRestoreDefault={turnTemplates.restoreDefault}
          onSave={turnTemplates.save}
        />
        <ChatTemplatesPanel
          title="System Prompt Sections"
          helpText="The text around each section of the system prompt. Line breaks are kept. Only the listed tags are accepted."
          fields={SYSTEM_PROMPT_SECTION_FIELDS}
          templates={systemPromptSections.templates}
          definitions={systemPromptSections.definitions}
          errors={systemPromptSections.errors}
          loadError={systemPromptSections.loadError}
          isLoading={systemPromptSections.isLoading}
          isSaving={systemPromptSections.isSaving}
          hasUnsavedChanges={systemPromptSections.hasUnsavedChanges}
          onChange={systemPromptSections.changeTemplate}
          onRestoreDefault={systemPromptSections.restoreDefault}
          onSave={systemPromptSections.save}
        />
        <DangerZone isErasing={isErasing} onErase={eraseAllAdventures} />
      </ScrollView>
    </View>
  );
}

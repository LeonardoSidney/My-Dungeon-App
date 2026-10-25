import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { screenStyles } from '@presentation/components';
import { useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { showError } from '@presentation/utils/showError';
import { ConnectionForm } from './ConnectionForm';
import { ConnectionPanel } from './ConnectionPanel';
import { DangerZone } from './DangerZone';
import { SystemPromptLoadOrderPanel } from './SystemPromptLoadOrderPanel';
import { initialConnectionForm, submitConnection, toConnectionFormState, validateConnectionForm } from './connectionForm';
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
        <DangerZone isErasing={isErasing} onErase={eraseAllAdventures} />
      </ScrollView>
    </View>
  );
}

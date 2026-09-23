import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { styles } from './styles';
import { ConnectionPanel } from './connectionPanel';
import { DangerZone } from './dangerZone/dangerZone';
import { useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { initialConnectionForm, submitConnection, toConnectionFormState, validateConnectionForm } from './form';

export function SettingsScreen () {
  const controllers = useControllers();
  const {
    createConnectionConfig,
    editConnection,
    eraseAdventures,
    eraseConnection,
    getConnections,
    alert,
  } = controllers;
  const [expandedConnection, setExpandedConnection] = useState(false);
  const [expandedDanger, setExpandedDanger] = useState(false);
  const [erasing, setErasing] = useState(false);

  const {
    entities,
    isLoading,
    isError,
    form,
    updateField,
    showForm,
    openAdd,
    openEdit,
    closeForm,
    formErrors,
    save,
    eraseEntity,
  } = useEntityScreen({
    fetch: () => getConnections.handle(),
    submit: (connectionForm) => submitConnection(connectionForm, createConnectionConfig, editConnection),
    erase: (id) => eraseConnection.handle(id),
    toFormState: toConnectionFormState,
    initialForm: initialConnectionForm,
    validate: validateConnectionForm,
    entityName: 'connection',
    alert,
  });

  const handleDangerErase = async () => {
    setErasing(true);
    try {
      await eraseAdventures.handle();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to erase adventures';
      alert.handle({ title: 'Erro', message });
    } finally {
      setErasing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <ConnectionPanel
          connections={entities}
          loading={isLoading}
          isError={isError}
          expanded={expandedConnection}
          onToggleExpand={() => setExpandedConnection(!expandedConnection)}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={eraseEntity}
          formVisible={showForm}
          formData={form}
          onFormChange={updateField}
          onFormCancel={closeForm}
          onFormSave={save}
          formErrors={formErrors}
          formLoading={false}
        />

        <DangerZone
          expanded={expandedDanger}
          erasing={erasing}
          onToggleExpand={() => setExpandedDanger(!expandedDanger)}
          onErase={handleDangerErase}
        />
      </ScrollView>
    </View>
  );
}

import React, { useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Connection } from '@domain/entities';
import { styles } from './styles';
import { ConnectionPanel } from './connectionPanel';
import { DangerZone } from './dangerZone/DangerZone';
import { useConnectionsLoad } from './useConnectionsLoad';
import { ConnectionFormData, FormErrors } from './constants';
import { setInitialConnectionState } from './constants';
import { handleConnectionFormChange } from './handleConnectionFormChange';
import { onAddNewConnection } from './onAddNewConnection';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onDeleteConnection } from './onDeleteConnection';
import { onSaveConnection } from './onSaveConnection';
import { validateConnectionForm, hasValidationErrors } from './validateConnectionForm';

export function SettingsScreen () {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionStateFormData, setConnectionFormData] = useState<ConnectionFormData>(setInitialConnectionState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [expandedConnection, setExpandedConnection] = useState(false);
  const [expandedDanger, setExpandedDanger] = useState(false);
  const [erasing, setErasing] = useState(false);

  useConnectionsLoad(setConnections);

  const handleDangerErase = async () => {
    setErasing(true);
    try {
      const { eraseAdventuresController } = await import('@infra/container');
      const ctrl = eraseAdventuresController();
      await ctrl.handle();
    } catch (error) {
      console.error('Failed to erase adventures:', error);
    } finally {
      setErasing(false);
    }
  };

  const handleFormSave = async () => {
    const errors = validateConnectionForm(connectionStateFormData);
    if (hasValidationErrors(errors)) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      await onSaveConnection(
        connectionStateFormData,
        setConnectionFormData,
        setShowForm,
        setConnections
      );
    } catch (error) {
      setFormErrors({ name: (error as Error).message });
    }
  };

  const handleFormChange = (field: keyof ConnectionFormData, value: string) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleConnectionFormChange(setConnectionFormData)(field, value);
  };

  const handleAddNewConnection = () => {
    setFormErrors({});
    onAddNewConnection(setShowForm, setConnectionFormData);
  };

  const handleEditConnection = (connection: Connection) => {
    setFormErrors({});
    onEditForm(connection, setShowForm, setConnectionFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <ConnectionPanel
          connections={connections}
          loading={false}
          expanded={expandedConnection}
          onToggleExpand={() => setExpandedConnection(!expandedConnection)}
          onAdd={handleAddNewConnection}
          onEdit={handleEditConnection}
          onDelete={(connectionId: string) => onDeleteConnection(connectionId, setConnections)}
          formVisible={showForm}
          formData={connectionStateFormData}
          onFormChange={handleFormChange}
          onFormCancel={() => onCancelForm(setShowForm, setConnectionFormData)}
          onFormSave={handleFormSave}
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

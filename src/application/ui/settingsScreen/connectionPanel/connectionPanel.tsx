import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Connection } from '@domain/entities';
import { ConnectionForm } from '../connectionForm';
import { ConnectionFormData } from '../constants';
import { styles } from './styles';

type ConnectionPanelProps = {
  connections: Connection[];
  loading: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onAdd: () => void;
  onEdit: (connection: Connection) => void;
  onDelete: (connectionId: string) => void;
  formVisible: boolean;
  formData: ConnectionFormData;
  onFormChange: (field: keyof ConnectionFormData, value: string) => void;
  onFormCancel: () => void;
  onFormSave: () => void;
  formErrors: { name?: string; port?: string; };
  formLoading: boolean;
};

export function ConnectionPanel ({
  connections,
  loading,
  expanded,
  onToggleExpand,
  onAdd,
  onEdit,
  onDelete,
  formVisible,
  formData,
  onFormChange,
  onFormCancel,
  onFormSave,
  formErrors,
  formLoading
}: ConnectionPanelProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleExpand}
      >
        <Text style={styles.headerTitle}>Connections</Text>
        <Text style={styles.expandIcon}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          {loading && <Text style={styles.loadingText}>Loading...</Text>}
          {!loading && connections.length === 0 && (
            <Text style={styles.emptyText}>No connections found.</Text>
          )}
          {!loading &&
            connections.map((connection) => (
              <View key={connection.id} style={styles.connectionItem}>
                <View style={styles.connectionInfo}>
                  <Text style={styles.connectionName}>{connection.name}</Text>
                  <Text style={styles.connectionDetails}>
                    {connection.ip}{connection.port ? `:${connection.port}` : ''}
                  </Text>
                </View>
                <View style={styles.connectionActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onEdit(connection)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onDelete(connection.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAdd}
          >
            <Text style={styles.addButtonText}>Add Connection</Text>
          </TouchableOpacity>
        </View>
      )}

      <ConnectionForm
        visible={formVisible}
        formData={formData}
        onChange={onFormChange}
        onCancel={onFormCancel}
        onSave={onFormSave}
        errors={formErrors}
        loading={formLoading}
      />
    </View>
  );
}

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Connection } from '@domain/entities';
import { Pencil, Trash2 } from 'lucide-react-native';
import { ConnectionForm } from '../connectionForm';
import { ConnectionFormData } from '../constants';
import { styles } from './styles';
import { colors } from '../../theme';

type ConnectionPanelProps = {
  connections: Connection[];
  loading: boolean;
  isError?: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onAdd: () => void;
  onEdit: (connection: Connection) => void;
  onDelete: (connection: Connection) => Promise<void>;
  formVisible: boolean;
  formData: ConnectionFormData;
  onFormChange: (field: keyof ConnectionFormData, value: string) => void;
  onFormCancel: () => void;
  onFormSave: () => void;
  formErrors: { name?: string; ip?: string; port?: string; };
  formLoading: boolean;
};

export function ConnectionPanel ({
  connections,
  loading,
  isError,
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
          {!loading && isError && <Text style={styles.errorText}>Failed to load connections.</Text>}
          {!loading && !isError && connections.length === 0 && (
            <Text style={styles.emptyText}>No connections found.</Text>
          )}
          {!loading && !isError &&
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
                    <Pencil size={16} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onDelete(connection)}
                  >
                    <Trash2 size={16} color={colors.text} />
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

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ConnectionForm } from '../connectionForm';
import { styles } from './styles';
import { useConnectionActions } from './useConnectionActions';
import { useConnectionPanel } from './useConnectionPanel';

export function ConnectionPanel () {
  const {
    expanded,
    setExpanded,
    connections,
    loading,
    loadConnections,
  } = useConnectionPanel();

  const handleFormSave = async () => {
    await loadConnections();
    handleFormClose();
  };

  const {
    showForm,
    editingConnection,
    handleDelete,
    handleEdit,
    handleAdd,
    handleFormClose,
  } = useConnectionActions(loadConnections);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
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
                    onPress={() => handleEdit(connection)}
                  >
                    <Text style={styles.actionButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDelete(connection.id)}
                  >
                    <Text style={styles.actionButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>Add Connection</Text>
          </TouchableOpacity>
        </View>
      )}

      <ConnectionForm
        visible={showForm}
        onClose={handleFormClose}
        onSave={handleFormSave}
        initialData={editingConnection}
      />
    </View>
  );
}

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { WorldMaster } from '@domain/entities';
import { styles } from './styles';

type WorldMasterPanelProps = {
  worldMasters: WorldMaster[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (worldMaster: WorldMaster) => void;
  onDelete: (worldMasterId: string) => void;
};

export function WorldMasterPanel ({ worldMasters, loading, onAdd, onEdit, onDelete }: WorldMasterPanelProps) {
  return (
    <>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {!loading && worldMasters.length === 0 && (
        <Text style={styles.emptyText}>No world masters found.</Text>
      )}
      {!loading &&
        worldMasters.map((worldMaster) => (
          <View key={worldMaster.id} style={styles.worldMasterItem}>
            <View style={styles.worldMasterInfo}>
              <Text style={styles.worldMasterName}>{worldMaster.name}</Text>
              <Text style={styles.worldMasterDetails}>
                Activation: {worldMaster.activationWord}
              </Text>
            </View>
            <View style={styles.worldMasterActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(worldMaster)}
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(worldMaster.id)}
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
        <Text style={styles.addButtonText}>Add World Master</Text>
      </TouchableOpacity>
    </>
  );
}

import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { WorldMaster } from '@domain/entities';
import { styles } from './styles';

type WorldMasterPanelProps = {
  worldMasters: WorldMaster[];
  onEdit: (worldMaster: WorldMaster) => void;
  onDelete: (worldMaster: WorldMaster) => void;
};

export function WorldMasterPanel ({ worldMasters, onEdit, onDelete }: WorldMasterPanelProps) {
  return (
    <View style={styles.container}>
      {worldMasters.length === 0 && (
        <Text style={styles.emptyText}>No world masters found.</Text>
      )}
      {worldMasters.map((worldMaster) => (
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
              onPress={() => onDelete(worldMaster)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

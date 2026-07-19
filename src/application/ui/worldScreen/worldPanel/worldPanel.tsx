import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { World } from '@domain/entities';
import { styles } from './styles';

type WorldPanelProps = {
  worlds: World[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (world: World) => void;
  onDelete: (worldId: string) => void;
};

export function WorldPanel ({ worlds, loading, onAdd, onEdit, onDelete }: WorldPanelProps) {
  return (
    <>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {!loading && worlds.length === 0 && (
        <Text style={styles.emptyText}>No worlds found.</Text>
      )}
      {!loading &&
        worlds.map((world) => (
          <View key={world.id} style={styles.worldItem}>
            <View style={styles.worldInfo}>
              <Text style={styles.worldName}>{world.name}</Text>
              <Text style={styles.worldDetails}>
                Activation: {world.activationWord}
              </Text>
            </View>
            <View style={styles.worldActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit(world)}
              >
                <Text style={styles.actionButtonText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDelete(world.id)}
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
        <Text style={styles.addButtonText}>Add World</Text>
      </TouchableOpacity>
    </>
  );
}

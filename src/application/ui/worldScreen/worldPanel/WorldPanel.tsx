import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { WorldPanelProps } from './constants';

export function WorldPanel (params: WorldPanelProps) {
  const { worlds, onEdit, onDelete } = params;

  return (
    <>
      {worlds.length === 0 && (
        <Text style={styles.emptyText}>No worlds found.</Text>
      )}
      {worlds.map((world) => (
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
              onPress={() => onDelete(world)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}

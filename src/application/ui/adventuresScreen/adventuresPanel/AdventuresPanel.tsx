import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AdventuresPanelProps } from './constants';

export function AdventuresPanel (params: AdventuresPanelProps) {
  const { adventures, onEdit, onDelete, onChat } = params;

  return (
    <>
      {adventures.length === 0 && <Text style={styles.emptyText}>No adventures found.</Text>}
      {adventures.map((adventure) => (
        <View key={adventure.id} style={styles.adventureItem}>
          <View style={styles.adventureInfo}>
            <Text style={styles.adventureName}>{adventure.name}</Text>
            <Text style={styles.adventureDetails}>Created: {adventure.createdAt.toLocaleDateString()}</Text>
          </View>
          <View style={styles.adventureActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => onChat(adventure)}>
              <Text style={styles.actionButtonText}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(adventure)}>
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(adventure)}>
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}

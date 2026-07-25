import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { AbilityPanelProps } from './constants';

export function AbilityPanel (params: AbilityPanelProps) {
  const { abilities, onEdit, onDelete } = params;

  return (
    <View>
      {abilities.map((ability, index) => (
        <View key={index} style={styles.abilityItem}>
          <View style={styles.abilityInfo}>
            <Text style={styles.abilityName}>{ability.name}</Text>
            <Text style={styles.abilityDetails}>{ability.activationWorld}</Text>
          </View>
          <View style={styles.abilityActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(ability)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(ability)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

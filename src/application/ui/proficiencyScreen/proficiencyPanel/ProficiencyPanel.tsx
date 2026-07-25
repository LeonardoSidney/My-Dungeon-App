import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { ProficiencyPanelProps } from '../constants';

export function ProficiencyPanel (params: ProficiencyPanelProps) {
  const { proficiencies, onEdit, onDelete } = params;

  return (
    <>
      {proficiencies.length === 0 && (
        <Text style={styles.emptyText}>No proficiencies found.</Text>
      )}
      {proficiencies.map((proficiency, index) => (
        <View key={index} style={styles.proficiencyItem}>
          <View style={styles.proficiencyInfo}>
            <Text style={styles.proficiencyName}>{proficiency.name}</Text>
            <Text style={styles.proficiencyDetails}>{proficiency.activationWord}</Text>
          </View>
          <View style={styles.proficiencyActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(proficiency)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(proficiency)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}

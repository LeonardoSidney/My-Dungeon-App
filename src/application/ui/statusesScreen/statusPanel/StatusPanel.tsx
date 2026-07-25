import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { StatusPanelProps } from './constants';

export function StatusPanel (params: StatusPanelProps) {
  const { statuses, onEdit, onDelete } = params;

  return (
    <View>
      {statuses.map((status, index) => (
        <View key={index} style={styles.statusItem}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusName}>{status.name}</Text>
            <Text style={styles.statusDetails}>{status.activationWord}</Text>
          </View>
          <View style={styles.statusActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(status)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(status)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

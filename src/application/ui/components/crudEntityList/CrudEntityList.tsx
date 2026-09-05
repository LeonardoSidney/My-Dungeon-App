import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import type { CrudEntityListProps } from './constants';

export function CrudEntityList<T extends { id: string; name: string; }> (params: CrudEntityListProps<T>) {
  const { items, emptyText, getDetailText, onEdit, onDelete } = params;

  if (items.length === 0) {
    return <Text style={styles.emptyText}>{emptyText}</Text>;
  }

  return (
    <>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            {getDetailText ? (
              <Text style={styles.details}>{getDetailText(item)}</Text>
            ) : null}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(item)}
            >
              <Text style={styles.actionButtonText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(item)}
            >
              <Text style={styles.actionButtonText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}

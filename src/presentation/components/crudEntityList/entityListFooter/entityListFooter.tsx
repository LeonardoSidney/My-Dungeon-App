import { Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import type { EntityListFooterProps } from './constants';

export function EntityListFooter (params: EntityListFooterProps) {
  const { addLabel, onAdd, form } = params;

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={onAdd}
      >
        <Text style={styles.addButtonText}>{addLabel}</Text>
      </TouchableOpacity>
      {form}
    </>
  );
}

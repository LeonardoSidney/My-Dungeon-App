import { Text, View } from 'react-native';
import { styles } from './styles';
import type { EntityItemProps } from './constants';

export function EntityItem (params: EntityItemProps) {
  const { name, details, detailLines, actions } = params;

  return (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {details ? (
          <Text style={styles.details} numberOfLines={detailLines}>
            {details}
          </Text>
        ) : null}
      </View>
      <View style={styles.actions}>
        {actions}
      </View>
    </View>
  );
}

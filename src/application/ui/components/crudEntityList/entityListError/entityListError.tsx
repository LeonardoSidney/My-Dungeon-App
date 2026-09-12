import { Text } from 'react-native';
import { styles } from './styles';
import type { EntityListErrorProps } from './constants';

export function EntityListError (params: EntityListErrorProps) {
  const { message } = params;

  return <Text style={styles.errorText}>{message}</Text>;
}

import { Text, View } from 'react-native';
import { Think } from '@domain/entities';
import { styles } from './styles';

interface AdventureThinkProps {
  think: Think;
}

export function AdventureThink({ think }: AdventureThinkProps) {
  if (!think.enabled || !think.content) return null;

  return (
    <View style={styles.thinkContainer}>
      <Text style={styles.thinkText}>{think.content}</Text>
    </View>
  );
}

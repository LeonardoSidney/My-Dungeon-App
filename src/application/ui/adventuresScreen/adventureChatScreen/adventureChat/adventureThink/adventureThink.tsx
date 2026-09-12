import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';
import { TextMarkdown } from '../textMarkdown';
import { AdventureThinkProps } from './constants';

export function AdventureThink ({ think, streamingThink }: AdventureThinkProps) {
  const currentThink = useMemo(() => {
    const selectedThink = streamingThink ? streamingThink : think;
    return selectedThink;
  }, [think, streamingThink]);

  if (!currentThink?.enabled || !currentThink.content) {
    return null;
  }

  const isStreaming = !!streamingThink;

  if (isStreaming) {
    return (
      <View style={styles.thinkContainer}>
        <Text style={styles.thinkText}>{currentThink.content}</Text>
      </View>
    );
  }

  return (
    <View style={styles.thinkContainer}>
      <TextMarkdown content={currentThink.content} style={styles.thinkText} />
    </View>
  );
}

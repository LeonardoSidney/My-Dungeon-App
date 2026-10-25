import { StyleSheet, View } from 'react-native';
import { TextAreaStream } from './TextAreaStream';

export function HomeScreen () {
  return (
    <View style={styles.container}>
      <TextAreaStream />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
});

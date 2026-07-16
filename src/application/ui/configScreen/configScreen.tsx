import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export function ConfigScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

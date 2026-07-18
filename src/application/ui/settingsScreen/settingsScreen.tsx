import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { ConnectionPanel } from './connectionPanel';

export function SettingsScreen () {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <ConnectionPanel />
      </View>
    </ScrollView>
  );
}

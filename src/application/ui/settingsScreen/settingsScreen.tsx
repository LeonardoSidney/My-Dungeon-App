import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { ConnectionPanel } from './connectionPanel';
import { DangerZone } from './dangerZone';

export function SettingsScreen () {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <ConnectionPanel />
        <DangerZone />
      </ScrollView>
    </View>
  );
}

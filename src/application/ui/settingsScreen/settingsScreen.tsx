import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { styles } from './styles';
import { ConnectionPanel } from './connectionPanel';
import { DangerZone } from './dangerZone';

export function SettingsScreen () {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>
          <ConnectionPanel />
          <DangerZone />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

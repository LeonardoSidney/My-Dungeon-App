import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

type DangerZoneProps = {
  expanded: boolean;
  erasing: boolean;
  onToggleExpand: () => void;
  onErase: () => void;
};

export function DangerZone ({
  expanded,
  erasing,
  onToggleExpand,
  onErase
}: DangerZoneProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleExpand}
      >
        <Text style={styles.headerTitle}>Danger Zone</Text>
        <Text style={styles.expandIcon}>{expanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <Text style={styles.warningText}>This action cannot be undone. All adventures will be permanently deleted.</Text>
          <TouchableOpacity
            style={[
              styles.eraseButton,
              erasing && styles.eraseButtonDisabled,
            ]}
            onPress={onErase}
            disabled={erasing}
          >
            <Text style={styles.eraseButtonText}>
              {erasing ? 'Erasing...' : 'Erase All Adventures'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

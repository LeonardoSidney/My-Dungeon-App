import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { useDangerZone } from './useDangerZone';

export function DangerZone () {
  const {
    expanded,
    setExpanded,
    erasing,
    handleErase,
  } = useDangerZone();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
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
            onPress={handleErase}
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

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '@presentation/theme';
import { CollapsibleSection } from './CollapsibleSection';

type DangerZoneProps = {
  isErasing: boolean;
  onErase: () => void;
};

export function DangerZone ({ isErasing, onErase }: DangerZoneProps) {
  return (
    <CollapsibleSection title="Danger Zone" headerColor={colors.dangerDark}>
      <Text style={styles.warningText}>This action cannot be undone. All adventures will be permanently deleted.</Text>
      <TouchableOpacity
        style={[styles.eraseButton, isErasing && styles.eraseButtonDisabled]}
        onPress={onErase}
        disabled={isErasing}
      >
        <Text style={styles.eraseButtonText}>{isErasing ? 'Erasing...' : 'Erase All Adventures'}</Text>
      </TouchableOpacity>
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  warningText: {
    color: colors.dangerSoft,
    fontSize: 14,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  eraseButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.dangerButton,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eraseButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  eraseButtonDisabled: {
    opacity: 0.6,
  },
});

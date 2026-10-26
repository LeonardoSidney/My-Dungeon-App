import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formStyles } from '@presentation/components';
import { colors } from '@presentation/theme';

type SettingsActionBarProps = {
  hasErrors: boolean;
  isApplying: boolean;
  onDiscard: () => void;
  onApply: () => void;
};

export function SettingsActionBar ({ hasErrors, isApplying, onDiscard, onApply }: SettingsActionBarProps) {
  const isApplyDisabled = hasErrors || isApplying;
  const message = hasErrors ? 'Fix the highlighted fields to apply' : 'Unsaved changes · applied from the next reply';
  const applyLabel = isApplying ? 'Applying...' : 'Apply';

  return (
    <View style={styles.bar}>
      <Text style={[styles.message, hasErrors && styles.errorMessage]} numberOfLines={2}>{message}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={formStyles.cancelButton} onPress={onDiscard} disabled={isApplying}>
          <Text style={formStyles.cancelButtonText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[formStyles.saveButton, isApplyDisabled && formStyles.saveButtonDisabled]}
          onPress={onApply}
          disabled={isApplyDisabled}
        >
          <Text style={formStyles.saveButtonText}>{applyLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
    backgroundColor: colors.surfaceInset,
  },
  message: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
  },
  errorMessage: {
    color: colors.dangerSoft,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});

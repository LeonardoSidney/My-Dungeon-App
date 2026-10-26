import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@presentation/theme';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function SegmentedControl<T extends string> ({ options, value, onChange, disabled = false }: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      {options.map(option => {
        const isSelected = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.segment, isSelected && styles.segmentSelected]}
            onPress={() => onChange(option.value)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled }}
          >
            <Text style={[styles.segmentText, isSelected && styles.segmentTextSelected]} numberOfLines={1}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  segmentSelected: {
    backgroundColor: colors.primary,
  },
  segmentText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  segmentTextSelected: {
    color: colors.text,
    fontWeight: '600',
  },
});

import { ComponentType } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@presentation/theme';

type IconProps = { size?: number; color?: string; };

type IconButtonProps = {
  icon: ComponentType<IconProps>;
  accessibilityLabel: string;
  onPress: () => void;
};

export function IconButton ({ icon: Icon, accessibilityLabel, onPress }: IconButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      <Icon size={16} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 6,
  },
});

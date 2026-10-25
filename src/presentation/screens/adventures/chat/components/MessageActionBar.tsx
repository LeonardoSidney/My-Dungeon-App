import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@presentation/theme';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

type Tone = 'accent' | 'success' | 'danger' | 'neutral';

export type MessageAction = {
  key: string;
  icon: string;
  tone: Tone;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export type VersionNavigation = {
  canNavigate: boolean;
  onPrevious: () => void;
  onNext: () => void;
  previousLabel: string;
  nextLabel: string;
};

type MessageActionBarProps = {
  versions?: VersionNavigation;
  actions: MessageAction[];
};

export function MessageActionBar ({ versions, actions }: MessageActionBarProps) {
  if (!versions && actions.length === 0) {
    return null;
  }

  const renderArrow = (symbol: string, label: string, onPress: () => void) => versions && (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={!versions.canNavigate}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={HIT_SLOP}
    >
      <Text style={[styles.text, versions.canNavigate ? styles.accent : styles.neutralMuted]}>{symbol}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {versions && renderArrow('<', versions.previousLabel, versions.onPrevious)}
      {actions.map(action => (
        <TouchableOpacity
          key={action.key}
          style={[styles.button, action.disabled && styles.disabled]}
          onPress={action.onPress}
          disabled={action.disabled}
          accessibilityRole="button"
          accessibilityLabel={action.accessibilityLabel}
          hitSlop={HIT_SLOP}
        >
          <Text style={[styles.text, styles[action.tone]]}>{action.icon}</Text>
        </TouchableOpacity>
      ))}
      {versions && renderArrow('>', versions.nextLabel, versions.onNext)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginRight: 4,
    gap: 4,
  },
  button: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  disabled: {
    opacity: 0.35,
  },
  text: {
    fontSize: 14,
  },
  accent: {
    color: colors.accentBlue,
  },
  success: {
    color: colors.success,
  },
  danger: {
    color: colors.dangerStrong,
  },
  neutral: {},
  neutralMuted: {
    color: colors.textSubtle,
  },
});

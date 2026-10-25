import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@presentation/theme';

type DetailHeaderProps = {
  title: string;
  onBack: () => void;
  right?: ReactNode;
};

export function DetailHeader ({ title, onBack, right }: DetailHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} accessibilityRole="button" accessibilityLabel="Back">
        <Text style={styles.headerText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

export const detailHeaderStyles = StyleSheet.create({
  actionText: {
    fontSize: 16,
    color: colors.text,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.surfaceAlt,
  },
  headerText: detailHeaderStyles.actionText,
  title: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  right: {
    minWidth: 56,
    alignItems: 'flex-end',
  },
});

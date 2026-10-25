import { ReactNode, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@presentation/theme';

type CollapsibleSectionProps = {
  title: string;
  headerColor?: string;
  children: ReactNode;
};

export function CollapsibleSection ({ title, headerColor = colors.surfaceAlt, children }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: headerColor }]}
        onPress={() => setIsExpanded(expanded => !expanded)}
      >
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? '▾' : '▸'}</Text>
      </TouchableOpacity>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  expandIcon: {
    fontSize: 18,
    color: colors.text,
  },
  content: {
    marginTop: 8,
    paddingHorizontal: 8,
  },
});

import { ReactNode, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@presentation/theme';

type CollapsibleSectionProps = {
  title: string;
  summary?: string;
  accessory?: ReactNode;
  headerColor?: string;
  initiallyExpanded?: boolean;
  children: ReactNode;
};

export function CollapsibleSection ({
  title,
  summary,
  accessory,
  headerColor = colors.surfaceAlt,
  initiallyExpanded = false,
  children,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const expandIcon = isExpanded ? '▾' : '▸';
  const showSummary = Boolean(summary) && !isExpanded;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: headerColor }]}
        onPress={() => setIsExpanded(expanded => !expanded)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>{title}</Text>
            {accessory}
          </View>
          {showSummary && <Text style={styles.summary} numberOfLines={1}>{summary}</Text>}
        </View>
        <Text style={styles.expandIcon}>{expandIcon}</Text>
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
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  summary: {
    marginTop: 2,
    fontSize: 13,
    color: colors.textMuted,
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

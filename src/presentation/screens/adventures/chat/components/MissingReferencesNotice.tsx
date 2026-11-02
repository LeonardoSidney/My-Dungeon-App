import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@presentation/theme';

type MissingReferencesNoticeProps = {
  issues: string[];
};

export function MissingReferencesNotice ({ issues }: MissingReferencesNoticeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sending is disabled until these are fixed:</Text>
      <ScrollView style={styles.issues} nestedScrollEnabled>
        {issues.map(issue => <Text key={issue} style={styles.issue}>{issue}</Text>)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.surfaceAlt,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dangerSoft,
    marginBottom: 8,
  },
  issues: {
    maxHeight: 120,
  },
  issue: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
});

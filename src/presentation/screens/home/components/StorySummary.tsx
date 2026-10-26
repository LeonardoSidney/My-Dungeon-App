import { StyleSheet, Text, View } from 'react-native';
import { HomeDailyActivityView } from '@domain/controllers';
import type { StorySummary as StorySummaryData } from '@domain/services';
import { colors } from '@presentation/theme';
import { ACTIVITY_BAR_MAX_HEIGHT, ACTIVITY_BAR_MIN_HEIGHT, WEEKDAY_INITIALS } from '../constants';
import { formatCount } from '../homeOverview';
import { homeCardStyles } from './homeCard.styles';

type StorySummaryProps = {
  summary: StorySummaryData;
  dailyActivity: HomeDailyActivityView[];
  streak: number;
};

function describeStreak (streak: number): string {
  if (streak === 0) {
    return 'No streak yet, play today to start one';
  }
  if (streak === 1) {
    return '1-day streak';
  }
  return `${streak}-day streak`;
}

function toBarHeight (messageCount: number, busiestDay: number): number {
  if (busiestDay === 0) {
    return ACTIVITY_BAR_MIN_HEIGHT;
  }
  return Math.max((messageCount / busiestDay) * ACTIVITY_BAR_MAX_HEIGHT, ACTIVITY_BAR_MIN_HEIGHT);
}

export function StorySummary ({ summary, dailyActivity, streak }: StorySummaryProps) {
  const metrics = [
    { label: 'lines you wrote', value: summary.linesWritten },
    { label: 'replies generated', value: summary.repliesGenerated },
    { label: 'words generated', value: summary.wordsGenerated },
    { label: 'rerolls', value: summary.rerolls },
  ];
  const busiestDay = Math.max(0, ...dailyActivity.map(day => day.messageCount));

  return (
    <View style={homeCardStyles.card}>
      <View style={styles.metrics}>
        {metrics.map(metric => (
          <View key={metric.label} style={styles.metric}>
            <Text style={styles.value}>{formatCount(metric.value)}</Text>
            <Text style={homeCardStyles.muted}>{metric.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.activity}>
        <View style={styles.activityHeader}>
          <Text style={homeCardStyles.label}>Last 7 days</Text>
          <Text style={styles.streak}>{describeStreak(streak)}</Text>
        </View>
        <View style={styles.bars}>
          {dailyActivity.map(day => (
            <View key={day.date} style={styles.day} accessibilityLabel={`${day.messageCount} messages`}>
              <View style={[styles.bar, { height: toBarHeight(day.messageCount, busiestDay) }]} />
              <Text style={styles.weekday}>{WEEKDAY_INITIALS[new Date(day.date).getDay()]}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 12,
  },
  metric: {
    width: '50%',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  activity: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceAlt,
    gap: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streak: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accentBlue,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  day: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    height: ACTIVITY_BAR_MAX_HEIGHT + 18,
  },
  bar: {
    alignSelf: 'stretch',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  weekday: {
    fontSize: 11,
    color: colors.textSubtle,
  },
});

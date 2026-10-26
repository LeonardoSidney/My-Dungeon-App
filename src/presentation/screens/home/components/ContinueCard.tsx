import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Play, Settings } from 'lucide-react-native';
import { IconButton } from '@presentation/components';
import { colors } from '@presentation/theme';
import { LAST_MESSAGE_PREVIEW_LINES } from '../constants';
import { HomeAdventureView } from '@domain/controllers';
import { formatDaysAgo } from '../homeOverview';
import { homeCardStyles } from './homeCard.styles';

type ContinueCardProps = {
  adventure: HomeAdventureView;
  narratorName?: string;
  castNames: string[];
  onContinue: () => void;
  onOpenSettings: () => void;
};

function describeTable (narratorName: string | undefined, castNames: string[]): string {
  const narratorText = narratorName ? `${narratorName} narrating` : 'No narrator';
  if (castNames.length === 0) {
    return narratorText;
  }
  return `${narratorText} · ${castNames.join(', ')}`;
}

export function ContinueCard ({ adventure, narratorName, castNames, onContinue, onOpenSettings }: ContinueCardProps) {
  const messageCountText = adventure.messageCount === 1 ? '1 message' : `${adventure.messageCount} messages`;
  const meta = `${messageCountText} · last played ${formatDaysAgo(adventure.lastActivityAt)}`;

  return (
    <View style={[homeCardStyles.card, styles.card]}>
      <View style={styles.header}>
        <Text style={[styles.name, styles.spacer]} numberOfLines={1}>{adventure.name}</Text>
        <IconButton icon={Settings} accessibilityLabel="Adventure settings" onPress={onOpenSettings} />
      </View>

      <Text style={homeCardStyles.muted} numberOfLines={1}>{describeTable(narratorName, castNames)}</Text>

      {adventure.lastMessage && (
        <Text style={styles.snippet} numberOfLines={LAST_MESSAGE_PREVIEW_LINES}>{`“${adventure.lastMessage}”`}</Text>
      )}
      {!adventure.lastMessage && <Text style={styles.snippet}>No messages yet, the story starts with your first line.</Text>}

      <View style={styles.footer}>
        <Text style={homeCardStyles.muted}>{meta}</Text>
        <TouchableOpacity style={styles.continueButton} onPress={onContinue} accessibilityRole="button">
          <Play size={16} color={colors.text} />
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spacer: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  snippet: {
    marginTop: 6,
    fontSize: 15,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  continueText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});

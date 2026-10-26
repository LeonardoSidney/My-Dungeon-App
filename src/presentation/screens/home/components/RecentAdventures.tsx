import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { screenStyles } from '@presentation/components';
import { colors } from '@presentation/theme';
import { HomeAdventureView } from '@domain/controllers';
import { formatDaysAgo } from '../homeOverview';
import { homeCardStyles } from './homeCard.styles';

type RecentAdventuresProps = {
  adventures: HomeAdventureView[];
  onOpen: (adventureId: string) => void;
  onNewAdventure: () => void;
};

export function RecentAdventures ({ adventures, onOpen, onNewAdventure }: RecentAdventuresProps) {
  return (
    <View style={homeCardStyles.card}>
      {adventures.length === 0 && <Text style={homeCardStyles.muted}>Your other adventures will show up here.</Text>}
      {adventures.map(adventure => (
        <TouchableOpacity
          key={adventure.id}
          style={homeCardStyles.row}
          onPress={() => onOpen(adventure.id)}
          accessibilityRole="button"
        >
          <View style={homeCardStyles.rowTexts}>
            <Text style={homeCardStyles.rowTitle} numberOfLines={1}>{adventure.name}</Text>
            <Text style={homeCardStyles.muted}>{`${adventure.messageCount} messages · last played ${formatDaysAgo(adventure.lastActivityAt)}`}</Text>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={screenStyles.addButton} onPress={onNewAdventure} accessibilityRole="button">
        <Text style={screenStyles.addButtonText}>+ New adventure</Text>
      </TouchableOpacity>
    </View>
  );
}

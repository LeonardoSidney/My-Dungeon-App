import { Text, View } from 'react-native';
import { Bot, Crown, Feather } from 'lucide-react-native';
import type { IconComponent } from '@presentation/components';
import { colors } from '@presentation/theme';
import type { ActivityHighlights } from '@domain/services';
import { homeCardStyles } from './homeCard.styles';

type HighlightsProps = {
  highlights: ActivityHighlights;
};

type HighlightRowProps = {
  icon: IconComponent;
  label: string;
  value: string;
};

function HighlightRow ({ icon: Icon, label, value }: HighlightRowProps) {
  return (
    <View style={homeCardStyles.row}>
      <Icon size={18} color={colors.textMuted} />
      <View style={homeCardStyles.rowTexts}>
        <Text style={homeCardStyles.muted}>{label}</Text>
        <Text style={homeCardStyles.rowTitle} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

export function Highlights ({ highlights }: HighlightsProps) {
  const { mostPlayed, hero, topModel } = highlights;
  const mostPlayedText = mostPlayed ? `${mostPlayed.name} · ${mostPlayed.messageCount} messages` : 'Play an adventure to see it here';
  const heroText = hero ? `${hero.name} · ${hero.lineCount} lines` : 'Write a line to see your hero here';
  const topModelText = topModel ? `${topModel.modelId} · ${topModel.replyCount} replies` : 'Generate a reply to see your top model here';

  return (
    <View style={homeCardStyles.card}>
      <HighlightRow icon={Crown} label="Most played" value={mostPlayedText} />
      <HighlightRow icon={Feather} label="Your hero" value={heroText} />
      <HighlightRow icon={Bot} label="Top model" value={topModelText} />
    </View>
  );
}

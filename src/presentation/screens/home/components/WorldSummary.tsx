import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Crown, Globe, Map, Users } from 'lucide-react-native';
import type { MenuRoute } from '@presentation/navigation/routes';
import type { IconComponent } from '@presentation/components';
import { colors } from '@presentation/theme';
import { CatalogEntityEnum, type CatalogCounts, type CatalogEntity } from '../homeOverview';
import { homeCardStyles } from './homeCard.styles';

type CatalogTile = {
  entity: CatalogEntity;
  label: string;
  firstLabel: string;
  route: MenuRoute;
  icon: IconComponent;
};

type CatalogChip = {
  entity: CatalogEntity;
  label: string;
  route: MenuRoute;
};

type WorldSummaryProps = {
  counts: CatalogCounts;
  onNavigate: (route: MenuRoute) => void;
};

const mainTiles: CatalogTile[] = [
  { entity: CatalogEntityEnum.ADVENTURES, label: 'Adventures', firstLabel: 'adventure', route: 'adventures', icon: Map },
  { entity: CatalogEntityEnum.CHARACTERS, label: 'Characters', firstLabel: 'character', route: 'characters', icon: Users },
  { entity: CatalogEntityEnum.WORLD_MASTERS, label: 'World Masters', firstLabel: 'world master', route: 'worldMasters', icon: Crown },
  { entity: CatalogEntityEnum.WORLDS, label: 'Worlds', firstLabel: 'world', route: 'worlds', icon: Globe },
];

const otherChips: CatalogChip[] = [
  { entity: CatalogEntityEnum.LOCATIONS, label: 'Locations', route: 'locations' },
  { entity: CatalogEntityEnum.ITEMS, label: 'Items', route: 'items' },
  { entity: CatalogEntityEnum.ABILITIES, label: 'Abilities', route: 'abilities' },
  { entity: CatalogEntityEnum.PROFICIENCIES, label: 'Proficiencies', route: 'proficiencies' },
  { entity: CatalogEntityEnum.STATUSES, label: 'Statuses', route: 'statuses' },
  { entity: CatalogEntityEnum.SYSTEM_PROMPTS, label: 'System prompts', route: 'systemPrompts' },
  { entity: CatalogEntityEnum.ASSISTANTS, label: 'Assistants', route: 'assistants' },
  { entity: CatalogEntityEnum.SAMPLERS, label: 'Samplers', route: 'samplers' },
];

export function WorldSummary ({ counts, onNavigate }: WorldSummaryProps) {
  return (
    <View>
      <View style={styles.grid}>
        {mainTiles.map(({ entity, label, firstLabel, route, icon: Icon }) => {
          const count = counts[entity];
          const isEmpty = count === 0;
          return (
            <TouchableOpacity
              key={entity}
              style={[homeCardStyles.card, styles.tile, isEmpty && styles.tileEmpty]}
              onPress={() => onNavigate(route)}
              accessibilityRole="button"
              accessibilityLabel={`${count} ${label}`}
            >
              <Icon size={20} color={colors.textMuted} />
              {!isEmpty && <Text style={styles.count}>{count}</Text>}
              {!isEmpty && <Text style={homeCardStyles.muted}>{label}</Text>}
              {isEmpty && <Text style={styles.createText}>{`+ Create your first ${firstLabel}`}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.chips}>
        {otherChips.map(({ entity, label, route }) => (
          <TouchableOpacity key={entity} style={styles.chip} onPress={() => onNavigate(route)} accessibilityRole="button">
            <Text style={styles.chipText}>{`${label} ${counts[entity]}`}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  tile: {
    width: '48.5%',
    minHeight: 104,
    gap: 4,
  },
  tileEmpty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surfaceInset,
  },
  count: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  createText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.accentBlue,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { EntityOption } from '@domain/controllers';
import { CollapsibleSection, SegmentedControl, formStyles, screenStyles, type SegmentOption } from '@presentation/components';
import { colors } from '@presentation/theme';
import { CharacterRoleEnum, type CharacterRole } from '../../form/adventureRoster';
import { ModifiedTag } from './ModifiedTag';
import { sectionStyles } from './settingsSection.styles';

type CastRole = Exclude<CharacterRole, CharacterRoleEnum.NARRATOR>;

type CastSectionProps = {
  characters: EntityOption[];
  getRole: (characterId: string) => CharacterRole;
  error?: string;
  isModified: boolean;
  onRoleChange: (character: EntityOption, role: CastRole) => void;
};

type CastMemberRowProps = {
  character: EntityOption;
  role: CharacterRole;
  onRoleChange: (character: EntityOption, role: CastRole) => void;
};

const castRoles: SegmentOption<CastRole>[] = [
  { value: CharacterRoleEnum.OFF, label: 'Out' },
  { value: CharacterRoleEnum.PLAYER, label: 'You' },
  { value: CharacterRoleEnum.AI, label: 'AI' },
];

function CastMemberRow ({ character, role, onRoleChange }: CastMemberRowProps) {
  const isNarrator = role === CharacterRoleEnum.NARRATOR;

  return (
    <View style={styles.row}>
      <Text style={styles.name} numberOfLines={1}>{character.name}</Text>
      <View style={styles.roleControl}>
        {isNarrator && <Text style={styles.narratorText}>Narrating</Text>}
        {!isNarrator && (
          <SegmentedControl options={castRoles} value={role} onChange={nextRole => onRoleChange(character, nextRole)} />
        )}
      </View>
    </View>
  );
}

export function CastSection ({ characters, getRole, error, isModified, onRoleChange }: CastSectionProps) {
  const roles = characters.map(character => getRole(character.id));
  const playerCount = roles.filter(role => role === CharacterRoleEnum.PLAYER).length;
  const aiCount = roles.filter(role => role === CharacterRoleEnum.AI).length;
  const summary = `You play ${playerCount} · AI plays ${aiCount}`;

  return (
    <CollapsibleSection title="Cast" summary={summary} accessory={<ModifiedTag isModified={isModified} />}>
      <Text style={sectionStyles.helpText}>
        Choose who takes part in the scene: characters you play, characters the AI plays, or characters left out.
        Their assistants are set in Generation and Your Characters.
      </Text>
      {characters.length === 0 && <Text style={screenStyles.emptyText}>No characters created yet.</Text>}
      {characters.map((character, index) => (
        <CastMemberRow key={character.id} character={character} role={roles[index]} onRoleChange={onRoleChange} />
      ))}
      {error && <Text style={formStyles.errorText}>{error}</Text>}
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceAlt,
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  roleControl: {
    width: 180,
  },
  narratorText: {
    textAlign: 'center',
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.accentBlue,
    paddingVertical: 8,
  },
});

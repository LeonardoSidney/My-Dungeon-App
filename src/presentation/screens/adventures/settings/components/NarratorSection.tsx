import { Text } from 'react-native';
import { EntityOption } from '@domain/controllers';
import { CollapsibleSection, FormField, SegmentedControl, SingleSelect, type SegmentOption } from '@presentation/components';
import { NarratorModeEnum, type NarratorMode } from '../adventureSettingsForm';
import { ModifiedTag } from './ModifiedTag';
import { sectionStyles } from './settingsSection.styles';

type NarratorSectionProps = {
  narratorMode: NarratorMode;
  narratorName?: string;
  worldMaster?: EntityOption;
  characterAsWorldMasterId?: string;
  worldMasters: EntityOption[];
  characters: EntityOption[];
  error?: string;
  isModified: boolean;
  onModeChange: (mode: NarratorMode) => void;
  onSelectWorldMaster: (worldMaster: EntityOption) => void;
  onSelectCharacter: (character: EntityOption) => void;
};

const narratorModes: SegmentOption<NarratorMode>[] = [
  { value: NarratorModeEnum.WORLD_MASTER, label: 'World Master' },
  { value: NarratorModeEnum.CHARACTER, label: 'A character' },
];

export function NarratorSection ({
  narratorMode,
  narratorName,
  worldMaster,
  characterAsWorldMasterId,
  worldMasters,
  characters,
  error,
  isModified,
  onModeChange,
  onSelectWorldMaster,
  onSelectCharacter,
}: NarratorSectionProps) {
  const summary = narratorName ?? 'No narrator';
  const isWorldMasterMode = narratorMode === NarratorModeEnum.WORLD_MASTER;

  return (
    <CollapsibleSection
      title="Narrator"
      summary={summary}
      accessory={<ModifiedTag isModified={isModified} />}
      initiallyExpanded
    >
      <Text style={sectionStyles.helpText}>
        The narrator drives the story and answers every message you send.
      </Text>

      <FormField label="Who narrates" error={error}>
        <SegmentedControl options={narratorModes} value={narratorMode} onChange={onModeChange} />
      </FormField>

      {isWorldMasterMode && (
        <FormField label="World Master">
          <SingleSelect
            items={worldMasters}
            selectedId={worldMaster?.id}
            onSelect={onSelectWorldMaster}
            emptyMessage="No world masters created yet"
          />
        </FormField>
      )}

      {!isWorldMasterMode && (
        <FormField label="Narrating character">
          <SingleSelect
            items={characters}
            selectedId={characterAsWorldMasterId}
            onSelect={onSelectCharacter}
            emptyMessage="No characters created yet"
          />
        </FormField>
      )}
    </CollapsibleSection>
  );
}

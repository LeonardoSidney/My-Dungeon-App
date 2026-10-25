import { EntityOption } from '@domain/controllers';
import { FormField, MultiSelect, SingleSelect } from '@presentation/components';

type CharacterRosterProps = {
  characters: EntityOption[];
  worldMasters: EntityOption[];
  selectedCharacters: EntityOption[];
  aiCharacterIds: string[];
  characterAsWorldMasterId?: string;
  worldMaster?: EntityOption;
  error?: string;
  onToggleCharacter: (character: EntityOption) => void;
  onToggleAiCharacter: (character: EntityOption) => void;
  onCharacterAsWorldMaster: (character: EntityOption) => void;
  onWorldMaster: (worldMaster: EntityOption) => void;
};

export function CharacterRoster ({
  characters,
  worldMasters,
  selectedCharacters,
  aiCharacterIds,
  characterAsWorldMasterId,
  worldMaster,
  error,
  onToggleCharacter,
  onToggleAiCharacter,
  onCharacterAsWorldMaster,
  onWorldMaster,
}: CharacterRosterProps) {
  const isPlayableCandidate = (id: string) => id !== characterAsWorldMasterId && !aiCharacterIds.includes(id);
  const playableCandidates = characters.filter(character => isPlayableCandidate(character.id));
  const aiCandidates = characters.filter(character => character.id !== characterAsWorldMasterId);
  const aiSelected = characters.filter(character => aiCharacterIds.includes(character.id));

  return (
    <>
      <FormField label="Characters" error={error}>
        <MultiSelect
          items={playableCandidates}
          selectedItems={selectedCharacters}
          tagItems={selectedCharacters.filter(character => isPlayableCandidate(character.id))}
          onToggle={onToggleCharacter}
          showTags
          emptyMessage="No characters available"
        />
      </FormField>

      {characters.length > 0 && (
        <FormField label="AI Controlled Characters">
          <MultiSelect items={aiCandidates} selectedItems={aiSelected} onToggle={onToggleAiCharacter} showTags />
        </FormField>
      )}

      {!worldMaster && characters.length > 0 && (
        <FormField label="No World Master Selected, Please Select a Character to Act as World Master">
          <SingleSelect items={characters} selectedId={characterAsWorldMasterId} onSelect={onCharacterAsWorldMaster} />
        </FormField>
      )}

      {worldMasters.length > 0 && (
        <FormField label="World Master (optional)">
          <SingleSelect items={worldMasters} selectedId={worldMaster?.id} onSelect={onWorldMaster} />
        </FormField>
      )}
    </>
  );
}

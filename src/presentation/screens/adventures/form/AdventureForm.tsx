import { EntityOption } from '@domain/controllers';
import { FormCard, FormField, MultiSelect, TextField } from '@presentation/components';
import { toggleById } from '@presentation/utils/toggleById';
import { CharacterRoster } from './CharacterRoster';
import type { AdventureFormData, AdventureFormErrors } from './adventureForm';
import { toggleAiCharacter, toggleCharacterAsWorldMaster, togglePlayableCharacter, toggleWorldMaster } from './adventureRoster';
import type { AdventureFormOptions } from './useAdventureFormOptions';

type AdventureFormProps = {
  form: AdventureFormData;
  formErrors: AdventureFormErrors;
  options: AdventureFormOptions;
  onChange: (changes: Partial<AdventureFormData>) => void;
  onCancel: () => void;
  onSave: () => void;
};

type OptionalListKey = 'worlds' | 'locations' | 'items';

const optionalLists: { key: OptionalListKey; label: string; }[] = [
  { key: 'worlds', label: 'Worlds (optional)' },
  { key: 'locations', label: 'Locations (optional)' },
  { key: 'items', label: 'Items (optional)' },
];

export function AdventureForm ({ form, formErrors, options, onChange, onCancel, onSave }: AdventureFormProps) {
  const isEditing = Boolean(form.id);

  const renderOptionalList = ({ key, label }: { key: OptionalListKey; label: string; }) => {
    const items = options[key];
    const loadError = options.errors[key];
    if (!loadError && items.length === 0) {
      return null;
    }
    return (
      <FormField key={key} label={label} loadError={loadError}>
        <MultiSelect
          items={items}
          selectedItems={form[key]}
          onToggle={(item: EntityOption) => onChange({ [key]: toggleById(form[key], item) })}
          showTags
        />
      </FormField>
    );
  };

  return (
    <FormCard
      title={isEditing ? 'Edit Adventure' : 'New Adventure'}
      saveLabel={isEditing ? 'Save' : 'Create'}
      onCancel={onCancel}
      onSave={onSave}
    >
      <TextField
        label="Name"
        placeholder="e.g., The Lost Kingdom"
        value={form.name}
        onChangeText={name => onChange({ name })}
        error={formErrors.name}
      />

      <FormField label="System Prompts" error={formErrors.systemPrompts} loadError={options.errors.systemPrompts}>
        <MultiSelect
          items={options.systemPrompts}
          selectedItems={form.systemPrompts}
          onToggle={systemPrompt => onChange({ systemPrompts: toggleById(form.systemPrompts, systemPrompt) })}
          showTags
          emptyMessage="No system prompts available"
        />
      </FormField>

      <CharacterRoster
        characters={options.characters}
        worldMasters={options.worldMasters}
        selectedCharacters={form.characters}
        aiCharacterIds={form.charactersControlledByAi}
        characterAsWorldMasterId={form.characterAsWorldMasterId}
        worldMaster={form.worldMaster}
        error={options.errors.characters ?? options.errors.worldMasters ?? formErrors.characters}
        onToggleCharacter={character => onChange(togglePlayableCharacter(form, character))}
        onToggleAiCharacter={character => onChange(toggleAiCharacter(form, character))}
        onCharacterAsWorldMaster={character => onChange(toggleCharacterAsWorldMaster(form, character))}
        onWorldMaster={worldMaster => onChange(toggleWorldMaster(form, worldMaster))}
      />

      {optionalLists.map(renderOptionalList)}
    </FormCard>
  );
}

import { Text } from 'react-native';
import { EntityOption } from '@domain/controllers';
import { CollapsibleSection, FormField, MultiSelect } from '@presentation/components';
import { toggleById } from '@presentation/utils/toggleById';
import type { AdventureFormData } from '../../form/adventureForm';
import { ModifiedTag } from './ModifiedTag';
import { sectionStyles } from './settingsSection.styles';

enum ContextKeyEnum {
  SYSTEM_PROMPTS = 'systemPrompts',
  WORLDS = 'worlds',
  LOCATIONS = 'locations',
  ITEMS = 'items',
}

type ContextKey = ContextKeyEnum.SYSTEM_PROMPTS | ContextKeyEnum.WORLDS | ContextKeyEnum.LOCATIONS | ContextKeyEnum.ITEMS;

type StoryContextSectionProps = {
  selected: Pick<AdventureFormData, ContextKey>;
  options: Record<ContextKey, EntityOption[]>;
  systemPromptsError?: string;
  isModified: boolean;
  onChange: (changes: Partial<Pick<AdventureFormData, ContextKey>>) => void;
};

const contextLists: { key: ContextKey; label: string; emptyMessage: string; }[] = [
  { key: ContextKeyEnum.SYSTEM_PROMPTS, label: 'System Prompts', emptyMessage: 'No system prompts created yet' },
  { key: ContextKeyEnum.WORLDS, label: 'Worlds', emptyMessage: 'No worlds created yet' },
  { key: ContextKeyEnum.LOCATIONS, label: 'Locations', emptyMessage: 'No locations created yet' },
  { key: ContextKeyEnum.ITEMS, label: 'Items', emptyMessage: 'No items created yet' },
];

function summarize (selected: Pick<AdventureFormData, ContextKey>): string {
  const parts = contextLists
    .filter(({ key }) => selected[key].length > 0)
    .map(({ key, label }) => `${label} ${selected[key].length}`);
  if (parts.length === 0) {
    return 'Nothing selected';
  }
  return parts.join(' · ');
}

export function StoryContextSection ({ selected, options, systemPromptsError, isModified, onChange }: StoryContextSectionProps) {
  return (
    <CollapsibleSection
      title="Story Context"
      summary={summarize(selected)}
      accessory={<ModifiedTag isModified={isModified} />}
    >
      <Text style={sectionStyles.helpText}>
        Everything selected here is injected into the prompt, so the narrator knows about it from the next reply on.
      </Text>
      {contextLists.map(({ key, label, emptyMessage }) => {
        const error = key === ContextKeyEnum.SYSTEM_PROMPTS ? systemPromptsError : undefined;
        return (
          <FormField key={key} label={label} error={error}>
            <MultiSelect
              items={options[key]}
              selectedItems={selected[key]}
              onToggle={(item: EntityOption) => onChange({ [key]: toggleById(selected[key], item) })}
              hasError={Boolean(error)}
              showTags
              emptyMessage={emptyMessage}
            />
          </FormField>
        );
      })}
    </CollapsibleSection>
  );
}

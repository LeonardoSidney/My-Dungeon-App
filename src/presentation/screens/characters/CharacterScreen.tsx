import { View } from 'react-native';
import { ActivationPromptListItem, CharacterDetails } from '@domain/controllers';
import {
  ActivationPromptForm,
  CrudEntityList,
  FormField,
  MultiSelect,
  SingleSelect,
  screenStyles,
  type ActivationPromptFormConfig,
} from '@presentation/components';
import { useEntityList, useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { toggleById } from '@presentation/utils/toggleById';
import { AttributesField } from './AttributesField';
import {
  initialCharacterForm,
  submitCharacter,
  toCharacterFormState,
  validateCharacterForm,
  type CharacterFormData,
} from './characterForm';

const characterFormConfig: ActivationPromptFormConfig = {
  entityName: 'Character',
  namePlaceholder: 'e.g., NPC Merchant',
  activationPlaceholder: 'e.g., Merchant',
  promptPlaceholder: 'Enter the character prompt...',
};

const getActivationWord = (entity: ActivationPromptListItem) => entity.activationWord;

export function CharacterScreen () {
  const {
    getAssistants,
    getAbilities,
    getProficiencies,
    getStatuses,
    getCharacters,
    getCharacter,
    createCharacter,
    editCharacter,
    eraseCharacter,
    alert,
  } = useControllers();
  const assistants = useEntityList({ fetch: () => getAssistants.handle() });
  const abilities = useEntityList({ fetch: () => getAbilities.handle() });
  const proficiencies = useEntityList({ fetch: () => getProficiencies.handle() });
  const statuses = useEntityList({ fetch: () => getStatuses.handle() });

  const screen = useEntityScreen<ActivationPromptListItem, CharacterFormData, CharacterDetails>({
    fetch: () => getCharacters.handle(),
    load: id => getCharacter.handle({ id }),
    submit: form => submitCharacter(form, createCharacter, editCharacter),
    erase: id => eraseCharacter.handle({ id }),
    toFormState: character => toCharacterFormState(character, {
      assistants: assistants.items,
      abilities: abilities.items,
      proficiencies: proficiencies.items,
      statuses: statuses.items,
    }),
    initialForm: initialCharacterForm,
    validate: validateCharacterForm,
    entityName: 'character',
    alert,
  });
  const { form, formErrors, updateField } = screen;

  return (
    <View style={screenStyles.container}>
      <CrudEntityList
        items={screen.entities}
        isLoading={screen.isLoading}
        isError={screen.isError}
        errorMessage="Failed to load characters."
        emptyText="No characters found."
        addLabel="Add Character"
        onAdd={screen.openAdd}
        onEdit={screen.openEdit}
        onDelete={screen.eraseEntity}
        getDetailText={getActivationWord}
        form={screen.showForm && (
          <ActivationPromptForm
            formData={form}
            config={characterFormConfig}
            formErrors={formErrors}
            onChange={updateField}
            onCancel={screen.closeForm}
            onSave={screen.save}
          >
            <FormField
              label="Assistant"
              error={formErrors.assistant}
              loadError={assistants.isError ? 'Failed to load assistants.' : undefined}
            >
              <SingleSelect
                items={assistants.items}
                selectedId={form.assistant?.id}
                hasError={Boolean(formErrors.assistant)}
                emptyMessage="No assistants available"
                onSelect={assistant => updateField('assistant', assistant)}
              />
            </FormField>

            <FormField label="Abilities" loadError={abilities.isError ? 'Failed to load abilities.' : undefined}>
              <MultiSelect
                items={abilities.items}
                selectedItems={form.abilities}
                emptyMessage="No abilities available"
                showTags
                onToggle={ability => updateField('abilities', toggleById(form.abilities, ability))}
              />
            </FormField>

            <FormField label="Proficiencies" loadError={proficiencies.isError ? 'Failed to load proficiencies.' : undefined}>
              <MultiSelect
                items={proficiencies.items}
                selectedItems={form.proficiencies}
                emptyMessage="No proficiencies available"
                showTags
                onToggle={proficiency => updateField('proficiencies', toggleById(form.proficiencies, proficiency))}
              />
            </FormField>

            <FormField label="Statuses" loadError={statuses.isError ? 'Failed to load statuses.' : undefined}>
              <MultiSelect
                items={statuses.items}
                selectedItems={form.statuses}
                emptyMessage="No statuses available"
                showTags
                onToggle={status => updateField('statuses', toggleById(form.statuses, status))}
              />
            </FormField>

            <AttributesField attributes={form.attributes} onChange={attributes => updateField('attributes', attributes)} />
          </ActivationPromptForm>
        )}
      />
    </View>
  );
}

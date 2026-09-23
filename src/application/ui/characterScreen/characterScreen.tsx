import React from 'react';
import { Text, View } from 'react-native';
import { Assistant, Ability, Proficiency, Status } from '@domain/entities';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, SelectField, SingleSelect, MultiSelect } from '@application/ui/components';
import { useEntityList, useEntityScreen } from '@application/ui/hooks';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { characterFormConfig } from './constants';
import { renderAttributesField } from './attributesFields';
import { toggleListItem, initialCharacterForm, submitCharacter, toCharacterFormState, validateCharacterForm } from './form';

export function CharacterScreen () {
  const { getAssistants, getAbilities, getProficiencies, getStatuses, createCharacter, editCharacter, eraseCharacter, getCharacters, alert } = useControllers();

  const assistants = useEntityList({ fetch: () => getAssistants.handle() });
  const abilities = useEntityList({ fetch: () => getAbilities.handle() });
  const proficiencies = useEntityList({ fetch: () => getProficiencies.handle() });
  const statuses = useEntityList({ fetch: () => getStatuses.handle() });

  const {
    entities,
    isLoading,
    isError,
    form,
    updateField,
    showForm,
    openAdd,
    openEdit,
    closeForm,
    formErrors,
    save,
    eraseEntity,
  } = useEntityScreen({
    fetch: () => getCharacters.handle(),
    submit: (characterForm) => submitCharacter(characterForm, createCharacter, editCharacter),
    erase: (id) => eraseCharacter.handle(id),
    toFormState: (character) => toCharacterFormState(character, assistants.items, abilities.items, proficiencies.items, statuses.items),
    initialForm: initialCharacterForm,
    validate: validateCharacterForm,
    entityName: 'character',
    alert,
  });

  const singleSelectError = assistants.isError ? (
    <Text style={styles.errorText}>Failed to load assistants.</Text>
  ) : (
    <SelectField label="Assistant" error={formErrors.assistant}>
      <SingleSelect
        items={assistants.items}
        selectedId={form.assistant?.id}
        hasError={!!formErrors.assistant}
        emptyMessage="No assistants available"
        onSelect={(assistant: Assistant) => updateField('assistant', assistant)}
      />
    </SelectField>
  );

  const multiSelectContent = (
    <>
      {abilities.isError ? (
        <Text style={styles.errorText}>Failed to load abilities.</Text>
      ) : (
        <SelectField label="Abilities">
          <MultiSelect
            items={abilities.items}
            selectedItems={form.abilities}
            emptyMessage="No abilities available"
            showTags
            onToggle={(ability: Ability) => updateField('abilities', toggleListItem(form.abilities, ability))}
          />
        </SelectField>
      )}
      {proficiencies.isError ? (
        <Text style={styles.errorText}>Failed to load proficiencies.</Text>
      ) : (
        <SelectField label="Proficiencies">
          <MultiSelect
            items={proficiencies.items}
            selectedItems={form.proficiencies}
            emptyMessage="No proficiencies available"
            showTags
            onToggle={(proficiency: Proficiency) => updateField('proficiencies', toggleListItem(form.proficiencies, proficiency))}
          />
        </SelectField>
      )}
      {statuses.isError ? (
        <Text style={styles.errorText}>Failed to load statuses.</Text>
      ) : (
        <SelectField label="Statuses">
          <MultiSelect
            items={statuses.items}
            selectedItems={form.statuses}
            emptyMessage="No statuses available"
            showTags
            onToggle={(status: Status) => updateField('statuses', toggleListItem(form.statuses, status))}
          />
        </SelectField>
      )}
    </>
  );

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={characterFormConfig}
      singleSelect={singleSelectError}
      multiSelect={multiSelectContent}
      extraFields={renderAttributesField(
        form.attributes,
        (attributes) => updateField('attributes', attributes)
      )}
      onChange={updateField}
      onCancel={closeForm}
      onSave={save}
      formErrors={formErrors}
    />
  );

  return (
    <View style={styles.container}>
      <CrudEntityList
        items={entities}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load characters."
        emptyText="No characters found."
        addLabel="Add Character"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(character) => character.activationWord}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}

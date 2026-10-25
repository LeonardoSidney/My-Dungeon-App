import { View } from 'react-native';
import { ActivationPromptListItem, WorldMasterDetails } from '@domain/controllers';
import {
  ActivationPromptForm,
  CrudEntityList,
  FormField,
  SingleSelect,
  screenStyles,
  type ActivationPromptFormConfig,
} from '@presentation/components';
import { useEntityList, useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import {
  initialWorldMasterForm,
  submitWorldMaster,
  toWorldMasterFormState,
  validateWorldMasterForm,
  type WorldMasterFormData,
} from './worldMasterForm';

const worldMasterFormConfig: ActivationPromptFormConfig = {
  entityName: 'World Master',
  namePlaceholder: 'e.g., Dungeon Master',
  activationPlaceholder: 'e.g., Dungeon',
  promptPlaceholder: 'Enter the world master prompt...',
};

const getActivationWord = (entity: ActivationPromptListItem) => entity.activationWord;

export function WorldMasterScreen () {
  const { getWorldMasters, getWorldMaster, getAssistants, createWorldMaster, editWorldMaster, eraseWorldMaster, alert } = useControllers();
  const assistants = useEntityList({ fetch: () => getAssistants.handle() });

  const screen = useEntityScreen<ActivationPromptListItem, WorldMasterFormData, WorldMasterDetails>({
    fetch: () => getWorldMasters.handle(),
    load: id => getWorldMaster.handle({ id }),
    submit: form => submitWorldMaster(form, createWorldMaster, editWorldMaster),
    erase: id => eraseWorldMaster.handle({ id }),
    toFormState: worldMaster => toWorldMasterFormState(worldMaster, assistants.items),
    initialForm: initialWorldMasterForm,
    validate: validateWorldMasterForm,
    entityName: 'world master',
    alert,
  });
  const { form, formErrors, updateField } = screen;

  return (
    <View style={screenStyles.container}>
      <CrudEntityList
        items={screen.entities}
        isLoading={screen.isLoading}
        isError={screen.isError}
        errorMessage="Failed to load world masters."
        emptyText="No world masters found."
        addLabel="Add World Master"
        onAdd={screen.openAdd}
        onEdit={screen.openEdit}
        onDelete={screen.eraseEntity}
        getDetailText={getActivationWord}
        form={screen.showForm && (
          <ActivationPromptForm
            formData={form}
            config={worldMasterFormConfig}
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
          </ActivationPromptForm>
        )}
      />
    </View>
  );
}

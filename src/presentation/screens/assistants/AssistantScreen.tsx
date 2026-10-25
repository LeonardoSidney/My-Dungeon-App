import { View } from 'react-native';
import { AssistantDetails, EntityOption, ModelOption } from '@domain/controllers';
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
  initialAssistantForm,
  modelKey,
  submitAssistant,
  toAssistantFormState,
  validateAssistantForm,
  type AssistantFormData,
} from './assistantForm';

const assistantFormConfig: ActivationPromptFormConfig = {
  entityName: 'Assistant',
  namePlaceholder: 'e.g., Dungeon Master Assistant',
};

export function AssistantScreen () {
  const { getAssistants, getAssistant, getModels, getSamplers, createAssistant, editAssistant, eraseAssistant, alert } = useControllers();
  const models = useEntityList({ fetch: () => getModels.handle() });
  const samplers = useEntityList({ fetch: () => getSamplers.handle() });

  const screen = useEntityScreen<EntityOption, AssistantFormData, AssistantDetails>({
    fetch: () => getAssistants.handle(),
    load: id => getAssistant.handle({ id }),
    submit: form => submitAssistant(form, createAssistant, editAssistant),
    erase: id => eraseAssistant.handle({ id }),
    toFormState: assistant => toAssistantFormState(assistant, models.items, samplers.items),
    initialForm: initialAssistantForm,
    validate: validateAssistantForm,
    entityName: 'assistant',
    alert,
  });
  const { form, formErrors, updateField } = screen;

  return (
    <View style={screenStyles.container}>
      <CrudEntityList
        items={screen.entities}
        isLoading={screen.isLoading}
        isError={screen.isError}
        errorMessage="Failed to load assistants."
        emptyText="No assistants found."
        addLabel="Add Assistant"
        onAdd={screen.openAdd}
        onEdit={screen.openEdit}
        onDelete={screen.eraseEntity}
        form={screen.showForm && (
          <ActivationPromptForm
            formData={form}
            config={assistantFormConfig}
            formErrors={formErrors}
            onChange={updateField}
            onCancel={screen.closeForm}
            onSave={screen.save}
          >
            <FormField label="Model" error={formErrors.model} loadError={models.isError ? 'Failed to load models.' : undefined}>
              <SingleSelect
                items={models.items}
                selectedId={form.model ? modelKey(form.model) : undefined}
                itemKey={modelKey}
                renderLabel={(model: ModelOption) => `${model.name} (${model.connectionName})`}
                hasError={Boolean(formErrors.model)}
                emptyMessage="No models available"
                onSelect={model => updateField('model', model)}
              />
            </FormField>

            <FormField label="Sampler" error={formErrors.sampler} loadError={samplers.isError ? 'Failed to load samplers.' : undefined}>
              <SingleSelect
                items={samplers.items}
                selectedId={form.sampler?.id}
                hasError={Boolean(formErrors.sampler)}
                emptyMessage="No samplers available"
                onSelect={sampler => updateField('sampler', sampler)}
              />
            </FormField>
          </ActivationPromptForm>
        )}
      />
    </View>
  );
}

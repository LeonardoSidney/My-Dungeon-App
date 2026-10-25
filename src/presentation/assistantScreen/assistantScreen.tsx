import React from 'react';
import { Text, View } from 'react-native';
import { AssistantDetails, EntityOption, ModelOption } from '@domain/controllers';
import { styles } from './styles';
import { ActivationPromptForm, CrudEntityList, SelectField, SingleSelect } from '@presentation/components';
import { useEntityList, useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/controllersProvider';
import { AssistantFormData, assistantFormConfig } from './constants';
import { initialAssistantForm, submitAssistant, toAssistantFormState, validateAssistantForm } from './form';

export function AssistantScreen () {
  const { getAssistants, getAssistant, getModels, getSamplers, createAssistant, editAssistant, eraseAssistant, alert } = useControllers();
  const models = useEntityList({ fetch: () => getModels.handle() });
  const samplers = useEntityList({ fetch: () => getSamplers.handle() });

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
  } = useEntityScreen<EntityOption, AssistantFormData, AssistantDetails>({
    fetch: () => getAssistants.handle(),
    load: (id) => getAssistant.handle({ id }),
    submit: (assistantForm) => submitAssistant(assistantForm, createAssistant, editAssistant),
    erase: (id) => eraseAssistant.handle({ id }),
    toFormState: (assistant) => toAssistantFormState(assistant, models.items, samplers.items),
    initialForm: initialAssistantForm,
    validate: validateAssistantForm,
    entityName: 'assistant',
    alert,
  });

  const renderForm = () => (
    <ActivationPromptForm
      showForm={showForm}
      formData={form}
      config={assistantFormConfig}
      singleSelect={
        <>
          {models.isError ? (
            <Text style={styles.errorText}>Failed to load models.</Text>
          ) : (
            <SelectField label="Model" error={formErrors.model}>
              <SingleSelect
                items={models.items}
                selectedId={form.model ? `${form.model.id}-${form.model.connectionId}` : undefined}
                itemKey={(model: ModelOption) => `${model.id}-${model.connectionId}`}
                renderLabel={(model: ModelOption) => `${model.name} (${model.connectionName})`}
                hasError={!!formErrors.model}
                emptyMessage="No models available"
                onSelect={(model: ModelOption) => updateField('model', model)}
              />
            </SelectField>
          )}
          {samplers.isError ? (
            <Text style={styles.errorText}>Failed to load samplers.</Text>
          ) : (
            <SelectField label="Sampler" error={formErrors.sampler}>
              <SingleSelect
                items={samplers.items}
                selectedId={form.sampler?.id}
                hasError={!!formErrors.sampler}
                emptyMessage="No samplers available"
                onSelect={(sampler: EntityOption) => updateField('sampler', sampler)}
              />
            </SelectField>
          )}
        </>
      }
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
        errorMessage="Failed to load assistants."
        emptyText="No assistants found."
        addLabel="Add Assistant"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        isFormOpen={showForm}
        renderForm={renderForm}
      />
    </View>
  );
}

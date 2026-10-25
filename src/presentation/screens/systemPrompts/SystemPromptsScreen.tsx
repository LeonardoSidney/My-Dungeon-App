import { View } from 'react-native';
import { SystemPromptListItem } from '@domain/controllers';
import { CrudEntityList, screenStyles } from '@presentation/components';
import { useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { SystemPromptForm } from './SystemPromptForm';
import { initialSystemPromptForm, submitSystemPrompt, toSystemPromptFormState, validateSystemPromptForm } from './systemPromptForm';

const getSystemPromptContent = (systemPrompt: SystemPromptListItem) => systemPrompt.content;

export function SystemPromptsScreen () {
  const { getSystemPrompts, getSystemPrompt, createSystemPrompt, editSystemPrompt, eraseSystemPrompt, alert } = useControllers();

  const screen = useEntityScreen({
    fetch: () => getSystemPrompts.handle(),
    load: id => getSystemPrompt.handle({ id }),
    submit: form => submitSystemPrompt(form, createSystemPrompt, editSystemPrompt),
    erase: id => eraseSystemPrompt.handle({ id }),
    toFormState: toSystemPromptFormState,
    initialForm: initialSystemPromptForm,
    validate: validateSystemPromptForm,
    entityName: 'system prompt',
    alert,
  });

  return (
    <View style={screenStyles.container}>
      <CrudEntityList
        items={screen.entities}
        isLoading={screen.isLoading}
        isError={screen.isError}
        errorMessage="Failed to load system prompts."
        emptyText="No system prompts found."
        addLabel="Add System Prompt"
        onAdd={screen.openAdd}
        onEdit={screen.openEdit}
        onDelete={screen.eraseEntity}
        getDetailText={getSystemPromptContent}
        detailLines={1}
        form={screen.showForm && (
          <SystemPromptForm
            formData={screen.form}
            formErrors={screen.formErrors}
            onChange={screen.updateField}
            onCancel={screen.closeForm}
            onSave={screen.save}
          />
        )}
      />
    </View>
  );
}

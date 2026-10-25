import { View } from 'react-native';
import { ActivationPromptDetails, ActivationPromptListItem } from '@domain/controllers';
import {
  ActivationPromptForm,
  CrudEntityList,
  screenStyles,
  type ActivationPromptFormConfig,
  type ActivationPromptFormData,
} from '@presentation/components';
import { useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import {
  initialActivationPromptForm,
  submitActivationPrompt,
  toFormState,
  validateActivationPromptForm,
  type ActivationPromptControllers,
} from './activationPromptForm';

export type ActivationPromptScreenConfig = ActivationPromptFormConfig & {
  /** Lowercase plural used in the list messages, e.g. "abilities". */
  pluralName: string;
};

type ActivationPromptScreenProps = {
  config: ActivationPromptScreenConfig;
  controllers: ActivationPromptControllers;
};

/** List + add/edit form for every entity made of name, activation word, prompt and observation. */
export function ActivationPromptScreen ({ config, controllers }: ActivationPromptScreenProps) {
  const { alert } = useControllers();

  const screen = useEntityScreen<ActivationPromptListItem, ActivationPromptFormData, ActivationPromptDetails>({
    fetch: () => controllers.list.handle(),
    load: id => controllers.get.handle({ id }),
    submit: form => submitActivationPrompt(form, controllers),
    erase: id => controllers.erase.handle({ id }),
    toFormState,
    initialForm: initialActivationPromptForm,
    validate: validateActivationPromptForm,
    entityName: config.entityName.toLowerCase(),
    alert,
  });

  return (
    <View style={screenStyles.container}>
      <CrudEntityList
        items={screen.entities}
        isLoading={screen.isLoading}
        isError={screen.isError}
        errorMessage={`Failed to load ${config.pluralName}.`}
        emptyText={`No ${config.pluralName} found.`}
        addLabel={`Add ${config.entityName}`}
        onAdd={screen.openAdd}
        onEdit={screen.openEdit}
        onDelete={screen.eraseEntity}
        getDetailText={entity => entity.activationWord}
        form={screen.showForm && (
          <ActivationPromptForm
            formData={screen.form}
            config={config}
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

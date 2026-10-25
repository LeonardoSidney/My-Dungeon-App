import { ReactNode } from 'react';
import { FormCard } from './FormCard';
import { TextField } from './TextField';

export type ActivationPromptFormData = {
  id: string;
  name: string;
  activationWord: string;
  prompt: string;
  observation: string;
};

export type ActivationPromptFormErrors = {
  name?: string;
  activationWord?: string;
  prompt?: string;
};

export type ActivationPromptFormConfig = {
  entityName: string;
  namePlaceholder: string;
  /** Omit to hide the activation word field. */
  activationPlaceholder?: string;
  /** Omit to hide the prompt field. */
  promptPlaceholder?: string;
};

type ActivationPromptFormProps = {
  formData: ActivationPromptFormData;
  config: ActivationPromptFormConfig;
  formErrors: ActivationPromptFormErrors;
  onChange: (field: keyof ActivationPromptFormData, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  /** Entity specific fields rendered after the common ones. */
  children?: ReactNode;
};

export function ActivationPromptForm ({ formData, config, formErrors, onChange, onCancel, onSave, children }: ActivationPromptFormProps) {
  const isEditing = Boolean(formData.id);

  return (
    <FormCard
      title={`${isEditing ? 'Edit' : 'Add'} ${config.entityName}`}
      saveLabel={isEditing ? 'Save' : 'Create'}
      onCancel={onCancel}
      onSave={onSave}
    >
      <TextField
        label="Name"
        placeholder={config.namePlaceholder}
        value={formData.name}
        onChangeText={value => onChange('name', value)}
        error={formErrors.name}
      />

      {config.activationPlaceholder && (
        <TextField
          label="Activation Word"
          placeholder={config.activationPlaceholder}
          value={formData.activationWord}
          onChangeText={value => onChange('activationWord', value)}
          error={formErrors.activationWord}
        />
      )}

      {config.promptPlaceholder && (
        <TextField
          label="Prompt"
          variant="tall"
          placeholder={config.promptPlaceholder}
          value={formData.prompt}
          onChangeText={value => onChange('prompt', value)}
          error={formErrors.prompt}
        />
      )}

      <TextField
        label="Observation (optional)"
        variant="multiline"
        placeholder="Additional observations..."
        value={formData.observation}
        onChangeText={value => onChange('observation', value)}
      />

      {children}
    </FormCard>
  );
}

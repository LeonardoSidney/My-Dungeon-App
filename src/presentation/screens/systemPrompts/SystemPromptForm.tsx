import { FormCard, TextField } from '@presentation/components';
import type { SystemPromptFormData, SystemPromptFormErrors } from './systemPromptForm';

type SystemPromptFormProps = {
  formData: SystemPromptFormData;
  formErrors: SystemPromptFormErrors;
  onChange: (field: keyof SystemPromptFormData, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function SystemPromptForm ({ formData, formErrors, onChange, onCancel, onSave }: SystemPromptFormProps) {
  const isEditing = Boolean(formData.id);

  return (
    <FormCard
      title={isEditing ? 'Edit System Prompt' : 'Add System Prompt'}
      saveLabel={isEditing ? 'Save' : 'Create'}
      onCancel={onCancel}
      onSave={onSave}
    >
      <TextField
        label="Name"
        placeholder="e.g., Default System Prompt"
        value={formData.name}
        onChangeText={value => onChange('name', value)}
        error={formErrors.name}
      />
      <TextField
        label="Content"
        variant="tall"
        placeholder="Enter the system prompt content..."
        value={formData.content}
        onChangeText={value => onChange('content', value)}
        error={formErrors.content}
      />
      <TextField
        label="Observation (optional)"
        variant="multiline"
        placeholder="Additional observations..."
        value={formData.observation}
        onChangeText={value => onChange('observation', value)}
      />
    </FormCard>
  );
}

import { FormCard, TextField } from '@presentation/components';
import type { ConnectionFormData, ConnectionFormErrors } from './connectionForm';

type ConnectionFormProps = {
  formData: ConnectionFormData;
  errors: ConnectionFormErrors;
  onChange: (field: keyof ConnectionFormData, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function ConnectionForm ({ formData, errors, onChange, onCancel, onSave }: ConnectionFormProps) {
  return (
    <FormCard
      title={formData.id ? 'Edit Connection' : 'New Connection'}
      saveLabel="Save"
      onCancel={onCancel}
      onSave={onSave}
    >
      <TextField
        label="Name"
        placeholder="e.g., My Server"
        value={formData.name}
        onChangeText={value => onChange('name', value)}
        error={errors.name}
      />
      <TextField
        label="IP Address"
        placeholder="e.g., http://192.168.1.100"
        keyboardType="url"
        value={formData.ip}
        onChangeText={value => onChange('ip', value)}
        error={errors.ip}
      />
      <TextField
        label="Port"
        placeholder="e.g., 8080"
        keyboardType="numeric"
        value={formData.port}
        onChangeText={value => onChange('port', value)}
        error={errors.port}
      />
      <TextField
        label="Auth Token (optional)"
        placeholder="Enter auth token"
        value={formData.auth}
        onChangeText={value => onChange('auth', value)}
        secureTextEntry
      />
    </FormCard>
  );
}

import { CollapsibleSection, TextField } from '@presentation/components';
import { ModifiedTag } from './ModifiedTag';

type GeneralSectionProps = {
  name: string;
  error?: string;
  isModified: boolean;
  onNameChange: (name: string) => void;
};

export function GeneralSection ({ name, error, isModified, onNameChange }: GeneralSectionProps) {
  return (
    <CollapsibleSection title="General" summary={name} accessory={<ModifiedTag isModified={isModified} />}>
      <TextField
        label="Adventure name"
        placeholder="e.g., The Lost Kingdom"
        value={name}
        onChangeText={onNameChange}
        error={error}
      />
    </CollapsibleSection>
  );
}

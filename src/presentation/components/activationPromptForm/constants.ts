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
    activationLabel?: string;
    namePlaceholder: string;
    activationPlaceholder?: string;
    promptPlaceholder?: string;
};

export type ActivationPromptFormProps = {
    showForm: boolean;
    formData: ActivationPromptFormData;
    config: ActivationPromptFormConfig;
    singleSelect?: React.ReactNode;
    multiSelect?: React.ReactNode;
    extraFields?: React.ReactNode;
    onChange: (field: keyof ActivationPromptFormData, value: string) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    formErrors: ActivationPromptFormErrors;
};

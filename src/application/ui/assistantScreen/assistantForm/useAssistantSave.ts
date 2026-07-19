import { Model, Sampler } from '@domain/entities';

type UseAssistantSaveParams = {
    onSave: (assistant: {
        name: string;
        observation?: string;
        model: Model;
        sampler: Sampler;
    }) => void;
    onClose: () => void;
    setLoading: (loading: boolean) => void;
};

export function useAssistantSave ({
    onSave,
    onClose,
    setLoading,
}: UseAssistantSaveParams) {
    const handleSave = async (
        name: string,
        observation: string,
        selectedModel: Model | null,
        selectedSampler: Sampler | null,
    ) => {
        if (!name.trim()) return;
        if (!selectedModel) return;
        if (!selectedSampler) return;

        setLoading(true);
        try {
            onSave({
                name: name.trim(),
                observation: observation.trim() || undefined,
                model: selectedModel,
                sampler: selectedSampler,
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return { handleSave };
}

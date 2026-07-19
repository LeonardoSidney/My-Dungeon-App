import { Assistant } from '@domain/entities';

type UseWorldMasterSaveParams = {
    onSave: (worldMaster: {
        name: string;
        activationWord: string;
        prompt: string;
        observation?: string;
        assistant: Assistant;
    }) => void;
    onClose: () => void;
    setLoading: (loading: boolean) => void;
};

export function useWorldMasterSave ({
    onSave,
    onClose,
    setLoading,
}: UseWorldMasterSaveParams) {
    const handleSave = async (
        name: string,
        activationWord: string,
        prompt: string,
        observation: string,
        selectedAssistant: Assistant | null,
    ) => {
        if (!name.trim() || !activationWord.trim() || !prompt.trim()) return;
        if (!selectedAssistant) return;

        setLoading(true);
        try {
            onSave({
                name: name.trim(),
                activationWord: activationWord.trim(),
                prompt: prompt.trim(),
                observation: observation.trim() || undefined,
                assistant: selectedAssistant,
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return { handleSave };
}

import { Assistant, Ability, Proficiency, Status, Attribute } from '@domain/entities';
import { UseCharacterSaveParams } from './constants';

export function useCharacterSave ({
    onSave,
    onClose,
    setLoading,
}: UseCharacterSaveParams) {
    const handleSave = async (
        name: string,
        activationWord: string,
        prompt: string,
        observation: string,
        selectedAssistant: Assistant | null,
        selectedAbilities: Ability[],
        selectedProficiencies: Proficiency[],
        selectedStatuses: Status[],
        attributes: Attribute[],
    ) => {
        if (!name.trim() || !activationWord.trim() || !prompt.trim()) return;
        if (!selectedAssistant) return;

        const filledAttributes = attributes.filter((attr) => attr.name.trim());

        setLoading(true);
        try {
            onSave({
                name: name.trim(),
                activationWord: activationWord.trim(),
                prompt: prompt.trim(),
                observation: observation.trim() || undefined,
                assistant: selectedAssistant,
                abilities: selectedAbilities,
                proficiencies: selectedProficiencies,
                statuses: selectedStatuses,
                attributes: filledAttributes,
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return { handleSave };
}

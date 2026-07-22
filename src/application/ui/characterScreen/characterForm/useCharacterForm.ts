import { useEffect, useState } from 'react';
import { Character, Ability, Proficiency, Status, Attribute } from '@domain/entities';
import { FormState, UseCharacterFormReturn } from './constants';

export function useCharacterForm (
    initialData?: Character | null
): UseCharacterFormReturn {
    const [formState, setFormState] = useState<FormState>({
        name: '',
        activationWord: '',
        prompt: '',
        observation: '',
    });

    const [loading, setLoading] = useState(false);
    const [selectedAbilities, setSelectedAbilities] = useState<Ability[]>([]);
    const [selectedProficiencies, setSelectedProficiencies] = useState<Proficiency[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([]);

    useEffect(() => {
        if (!initialData) {
            setFormState({
                name: '',
                activationWord: '',
                prompt: '',
                observation: '',
            });
            setSelectedAbilities([]);
            setSelectedProficiencies([]);
            setSelectedStatuses([]);
            setAttributes([]);
            return;
        }

        setFormState({
            name: initialData.name || '',
            activationWord: initialData.activationWord || '',
            prompt: initialData.prompt || '',
            observation: initialData.observation || '',
        });
        setSelectedAbilities(initialData.abilities || []);
        setSelectedProficiencies(initialData.proficiencies || []);
        setSelectedStatuses(initialData.statuses || []);
        setAttributes(initialData.attributes || []);
    }, [initialData]);

    const updateField = (field: keyof FormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const toggleAbility = (ability: Ability) => {
        setSelectedAbilities((prev) => {
            const exists = prev.find((a) => a.id === ability.id);

            if (exists) {
                return prev.filter((a) => a.id !== ability.id);
            }

            return [...prev, ability];
        });
    };

    const toggleProficiency = (proficiency: Proficiency) => {
        setSelectedProficiencies((prev) => {
            const exists = prev.find((p) => p.id === proficiency.id);

            if (exists) {
                return prev.filter((p) => p.id !== proficiency.id);
            }

            return [...prev, proficiency];
        });
    };

    const toggleStatus = (status: Status) => {
        setSelectedStatuses((prev) => {
            const exists = prev.find((s) => s.id === status.id);

            if (exists) {
                return prev.filter((s) => s.id !== status.id);
            }

            return [...prev, status];
        });
    };

    const addAttribute = () => {
        setAttributes((prev) => [...prev, { name: '', value: 0 }]);
    };

    const removeAttribute = (index: number) => {
        setAttributes((prev) => prev.filter((_, i) => i !== index));
    };

    const updateAttribute = (index: number, field: 'name' | 'value', value: string) => {
        setAttributes((prev) => {
            const updated = [...prev];

            if (field === 'value') {
                updated[index] = { ...updated[index], value: Number(value) || 0 };

                return updated;
            }

            updated[index] = { ...updated[index], [field]: value };

            return updated;
        });
    };

    return {
        formState,
        loading,
        updateField,
        setLoading,
        selectedAbilities,
        selectedProficiencies,
        selectedStatuses,
        toggleAbility,
        toggleProficiency,
        toggleStatus,
        attributes,
        addAttribute,
        removeAttribute,
        updateAttribute,
    };
}

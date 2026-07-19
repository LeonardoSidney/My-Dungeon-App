import { useEffect, useState } from 'react';
import { Sampler, MirostatEnum } from '@domain/entities';
import { emptyFormState } from './constants';

type FormState = typeof emptyFormState;

type UseSamplerFormReturn = {
    formState: FormState;
    loading: boolean;
    updateField: (field: keyof FormState, value: string) => void;
    setMirostat: (value: MirostatEnum) => void;
    setLoading: (loading: boolean) => void;
    resetForm: () => void;
    handleSave: (onSave: (sampler: Omit<Sampler, 'id' | 'createdAt' | 'updatedAt'>) => void, onClose: () => void) => void;
};

export function useSamplerForm (initialData?: Sampler | null, resetKey?: number): UseSamplerFormReturn {
    const [formState, setFormState] = useState(emptyFormState);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!initialData) {
            setFormState(emptyFormState);
            return;
        }
        setFormState({
            name: initialData.name,
            observation: initialData.observation || '',
            temperature: initialData.temperature?.toString() || '',
            topP: initialData.topP?.toString() || '',
            topK: initialData.topK?.toString() || '',
            minP: initialData.minP?.toString() || '',
            repeatLastN: initialData.repeatLastN?.toString() || '',
            repeatPenalty: initialData.repeatPenalty?.toString() || '',
            frequencyPenalty: initialData.frequencyPenalty?.toString() || '',
            presencePenalty: initialData.presencePenalty?.toString() || '',
            mirostat: initialData.mirostat,
            mirostatEnt: initialData.mirostatEnt?.toString() || '',
            mirostatLr: initialData.mirostatLr?.toString() || '',
            seed: initialData.seed || '',
            dryAllowedLenght: initialData.dryAllowedLenght?.toString() || '',
            dryBase: initialData.dryBase?.toString() || '',
            dryMultiplier: initialData.dryMultiplier?.toString() || '',
            drySequenceBreakers: initialData.drySequenceBreakers || '',
            dynaTempExp: initialData.dynaTempExp?.toString() || '',
            dynaTempRange: initialData.dynaTempRange?.toString() || '',
            topNSigma: initialData.topNSigma?.toString() || '',
            typicalP: initialData.typicalP?.toString() || '',
            xtcProbability: initialData.xtcProbability?.toString() || '',
            xtcThreshould: initialData.xtcThreshould?.toString() || '',
            adaptativeDecay: initialData.adaptativeDecay?.toString() || '',
            adaptativeTarget: initialData.adaptativeTarget?.toString() || '',
            ignoreEOS: initialData.ignoreEOS ? 'true' : '',
        });
    }, [initialData, resetKey]);

    const updateField = (field: keyof FormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const setMirostat = (value: MirostatEnum) => {
        setFormState((prev) => ({ ...prev, mirostat: value }));
    };

    const resetForm = () => {
        setFormState(emptyFormState);
    };

    const handleSave = (onSave: (sampler: Omit<Sampler, 'id' | 'createdAt' | 'updatedAt'>) => void, onClose: () => void) => {
        if (!formState.name.trim()) return;

        setLoading(true);
        try {
            onSave({
                name: formState.name.trim(),
                observation: formState.observation.trim() || undefined,
                temperature: formState.temperature ? parseFloat(formState.temperature) : undefined,
                topP: formState.topP ? parseFloat(formState.topP) : undefined,
                topK: formState.topK ? parseInt(formState.topK, 10) : undefined,
                minP: formState.minP ? parseFloat(formState.minP) : undefined,
                repeatLastN: formState.repeatLastN ? parseInt(formState.repeatLastN, 10) : undefined,
                repeatPenalty: formState.repeatPenalty ? parseFloat(formState.repeatPenalty) : undefined,
                frequencyPenalty: formState.frequencyPenalty ? parseFloat(formState.frequencyPenalty) : undefined,
                presencePenalty: formState.presencePenalty ? parseFloat(formState.presencePenalty) : undefined,
                mirostat: formState.mirostat,
                mirostatEnt: formState.mirostatEnt ? parseFloat(formState.mirostatEnt) : undefined,
                mirostatLr: formState.mirostatLr ? parseFloat(formState.mirostatLr) : undefined,
                seed: formState.seed.trim() || undefined,
                dryAllowedLenght: formState.dryAllowedLenght ? parseInt(formState.dryAllowedLenght, 10) : undefined,
                dryBase: formState.dryBase ? parseFloat(formState.dryBase) : undefined,
                dryMultiplier: formState.dryMultiplier ? parseFloat(formState.dryMultiplier) : undefined,
                drySequenceBreakers: formState.drySequenceBreakers.trim() || undefined,
                dynaTempExp: formState.dynaTempExp ? parseFloat(formState.dynaTempExp) : undefined,
                dynaTempRange: formState.dynaTempRange ? parseInt(formState.dynaTempRange, 10) : undefined,
                topNSigma: formState.topNSigma ? parseFloat(formState.topNSigma) : undefined,
                typicalP: formState.typicalP ? parseFloat(formState.typicalP) : undefined,
                xtcProbability: formState.xtcProbability ? parseFloat(formState.xtcProbability) : undefined,
                xtcThreshould: formState.xtcThreshould ? parseFloat(formState.xtcThreshould) : undefined,
                adaptativeDecay: formState.adaptativeDecay ? parseFloat(formState.adaptativeDecay) : undefined,
                adaptativeTarget: formState.adaptativeTarget ? parseFloat(formState.adaptativeTarget) : undefined,
                ignoreEOS: formState.ignoreEOS === '' ? undefined : formState.ignoreEOS === 'true' ? true : false,
                systemDefault: false,
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return {
        formState,
        loading,
        updateField,
        setMirostat,
        setLoading,
        resetForm,
        handleSave,
    };
}

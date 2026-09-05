import { Alert } from 'react-native';
import { SamplerFormData } from '../constants';
import { Sampler } from '@domain/entities';
import { onCreate } from './onCreate';
import { onEdit } from './onEdit';

export async function onSubmit (formData: SamplerFormData) {
    if (!formData.name.trim()) {
        Alert.alert('Erro', 'Name is required');
        return;
    }

    if (formData.id) {
        const response = await onEdit(formData);
        if (response && !response.success) {
            Alert.alert('Erro', response.error ?? 'Failed to save sampler');
        }
        return response;
    }

    const samplerData: Omit<Sampler, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formData.name.trim(),
        observation: formData.observation.trim() || undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        topP: formData.topP ? parseFloat(formData.topP) : undefined,
        topK: formData.topK ? parseInt(formData.topK, 10) : undefined,
        minP: formData.minP ? parseFloat(formData.minP) : undefined,
        repeatLastN: formData.repeatLastN ? parseInt(formData.repeatLastN, 10) : undefined,
        repeatPenalty: formData.repeatPenalty ? parseFloat(formData.repeatPenalty) : undefined,
        frequencyPenalty: formData.frequencyPenalty ? parseFloat(formData.frequencyPenalty) : undefined,
        presencePenalty: formData.presencePenalty ? parseFloat(formData.presencePenalty) : undefined,
        mirostat: formData.mirostat,
        mirostatEnt: formData.mirostatEnt ? parseFloat(formData.mirostatEnt) : undefined,
        mirostatLr: formData.mirostatLr ? parseFloat(formData.mirostatLr) : undefined,
        seed: formData.seed.trim() || undefined,
        dryAllowedLenght: formData.dryAllowedLenght ? parseInt(formData.dryAllowedLenght, 10) : undefined,
        dryBase: formData.dryBase ? parseFloat(formData.dryBase) : undefined,
        dryMultiplier: formData.dryMultiplier ? parseFloat(formData.dryMultiplier) : undefined,
        drySequenceBreakers: formData.drySequenceBreakers.trim() || undefined,
        dynaTempExp: formData.dynaTempExp ? parseFloat(formData.dynaTempExp) : undefined,
        dynaTempRange: formData.dynaTempRange ? parseInt(formData.dynaTempRange, 10) : undefined,
        topNSigma: formData.topNSigma ? parseFloat(formData.topNSigma) : undefined,
        typicalP: formData.typicalP ? parseFloat(formData.typicalP) : undefined,
        xtcProbability: formData.xtcProbability ? parseFloat(formData.xtcProbability) : undefined,
        xtcThreshould: formData.xtcThreshould ? parseFloat(formData.xtcThreshould) : undefined,
        adaptativeDecay: formData.adaptativeDecay ? parseFloat(formData.adaptativeDecay) : undefined,
        adaptativeTarget: formData.adaptativeTarget ? parseFloat(formData.adaptativeTarget) : undefined,
        ignoreEOS: formData.ignoreEOS === '' ? undefined : formData.ignoreEOS === 'true' ? true : false,
        systemDefault: false,
    };

    const response = await onCreate(samplerData);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to create sampler');
    }
    return response;
}

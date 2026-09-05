import { Sampler } from '@domain/entities';
import { SamplerFormData } from './constants';
import { Dispatch, SetStateAction } from 'react';
import { setInitialSamplerState } from './setInitialSamplerState';

export function onEditForm (
    sampler: Sampler,
    setShowForm: Dispatch<SetStateAction<boolean>>,
    setSamplerFormData: Dispatch<SetStateAction<SamplerFormData>>,
) {
    setShowForm(true);
    setSamplerFormData(setInitialSamplerState());
    setSamplerFormData({
        id: sampler.id,
        name: sampler.name,
        observation: sampler.observation ?? '',
        temperature: sampler.temperature?.toString() || '',
        topP: sampler.topP?.toString() || '',
        topK: sampler.topK?.toString() || '',
        minP: sampler.minP?.toString() || '',
        repeatLastN: sampler.repeatLastN?.toString() || '',
        repeatPenalty: sampler.repeatPenalty?.toString() || '',
        frequencyPenalty: sampler.frequencyPenalty?.toString() || '',
        presencePenalty: sampler.presencePenalty?.toString() || '',
        mirostat: sampler.mirostat,
        mirostatEnt: sampler.mirostatEnt?.toString() || '',
        mirostatLr: sampler.mirostatLr?.toString() || '',
        seed: sampler.seed || '',
        dryAllowedLenght: sampler.dryAllowedLenght?.toString() || '',
        dryBase: sampler.dryBase?.toString() || '',
        dryMultiplier: sampler.dryMultiplier?.toString() || '',
        drySequenceBreakers: sampler.drySequenceBreakers || '',
        dynaTempExp: sampler.dynaTempExp?.toString() || '',
        dynaTempRange: sampler.dynaTempRange?.toString() || '',
        topNSigma: sampler.topNSigma?.toString() || '',
        typicalP: sampler.typicalP?.toString() || '',
        xtcProbability: sampler.xtcProbability?.toString() || '',
        xtcThreshould: sampler.xtcThreshould?.toString() || '',
        adaptativeDecay: sampler.adaptativeDecay?.toString() || '',
        adaptativeTarget: sampler.adaptativeTarget?.toString() || '',
        ignoreEOS: sampler.ignoreEOS ? 'true' : '',
    });
}

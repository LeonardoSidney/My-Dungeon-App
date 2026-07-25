import { MirostatEnum } from '@domain/entities';
import { SamplerFormData } from './constants';

export function setInitialSamplerState (): SamplerFormData {
    return {
        id: '',
        name: '',
        observation: '',
        temperature: '',
        topP: '',
        topK: '',
        minP: '',
        repeatLastN: '',
        repeatPenalty: '',
        frequencyPenalty: '',
        presencePenalty: '',
        mirostat: undefined as MirostatEnum | undefined,
        mirostatEnt: '',
        mirostatLr: '',
        seed: '',
        dryAllowedLenght: '',
        dryBase: '',
        dryMultiplier: '',
        drySequenceBreakers: '',
        dynaTempExp: '',
        dynaTempRange: '',
        topNSigma: '',
        typicalP: '',
        xtcProbability: '',
        xtcThreshould: '',
        adaptativeDecay: '',
        adaptativeTarget: '',
        ignoreEOS: '',
        createdAt: undefined,
        updatedAt: undefined,
    };
}

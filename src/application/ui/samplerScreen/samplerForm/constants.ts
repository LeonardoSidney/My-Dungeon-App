import { MirostatEnum } from '@domain/entities';

type FormState = {
    name: string;
    observation: string;
    temperature: string;
    topP: string;
    topK: string;
    minP: string;
    repeatLastN: string;
    repeatPenalty: string;
    frequencyPenalty: string;
    presencePenalty: string;
    mirostat: MirostatEnum | undefined;
    mirostatEnt: string;
    mirostatLr: string;
    seed: string;
    dryAllowedLenght: string;
    dryBase: string;
    dryMultiplier: string;
    drySequenceBreakers: string;
    dynaTempExp: string;
    dynaTempRange: string;
    topNSigma: string;
    typicalP: string;
    xtcProbability: string;
    xtcThreshould: string;
    adaptativeDecay: string;
    adaptativeTarget: string;
    ignoreEOS: string;
};

export const emptyFormState: FormState = {
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
};
